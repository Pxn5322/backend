import { prisma } from "../lib/prisma";
import { adminAuth } from "../config/firebaseAdmin";
import { UserRole } from "../../generated/prisma";

export async function getUsers(tenantId: string) {
    return prisma.user.findMany({
        where: {
            tenantId,
            role: {
                not: "ENTERPRISE",
            },
        },
        orderBy: {
            createdAt: "asc",
        },
    });
}

export async function createUser(tenantId: string, name: string, email: string, password: string, role: UserRole) {
    const existing = await prisma.user.findUnique({
        where: { email, },
    });

    if (existing) {
        throw new Error("Email already exists.");
    }

    const allowedRoles = ["ADMIN", "AGENT", "USER",];

    if (!allowedRoles.includes(role)) {
        throw new Error("Invalid role.");
    }

    const firebaseUser = await adminAuth.createUser({
        email,
        password,
        displayName: name,
    });

    try {
        const user = await prisma.user.create({
            data: {
                id: firebaseUser.uid,
                name,
                email,
                role,
                tenantId,
            },
        });

        return user;
    } catch (error) {
        await adminAuth.deleteUser(firebaseUser.uid);
        throw error;
    }
}

export async function updateUser(tenantId: string, currentUserId: string, id: string, name: string, email: string, role: UserRole) {
    if (currentUserId === id) {
        throw new Error("You cannot edit your own account.");
    }

    const user = await prisma.user.findFirst({
        where: { id, tenantId, },
    });

    if (!user) {
        throw new Error("User not found.");
    }

    const allowedRoles = ["ADMIN", "AGENT", "USER",];

    if (!allowedRoles.includes(role)) {
        throw new Error("Invalid role.");
    }

    const emailOwner = await prisma.user.findFirst({
        where: {
            email,
            NOT: { id, },
        },
    });

    if (emailOwner) {
        throw new Error("Email already exists.");
    }

    await adminAuth.updateUser(id, {
        displayName: name,
        email,
    });

    return prisma.user.update({
        where: { id, },
        data: {
            name,
            email,
            role,
        },
    });
}

export async function changePassword(tenantId: string, currentUserId: string, id: string, password: string) {
    const user = await prisma.user.findFirst({
        where: {
            id,
            tenantId,
        },
    });

    if (!user) {
        throw new Error("User not found.");
    }

    if (user.role === UserRole.ENTERPRISE) {
        throw new Error("Cannot reset Enterprise password.");
    }

    if (currentUserId === id) {
        throw new Error("You cannot reset your own password here.");
    }

    await adminAuth.updateUser(id, {
        password,
    });

    return {
        message: "Password updated successfully.",
    };
}

export async function deleteUser(tenantId: string, currentUserId: string, id: string) {
    const user = await prisma.user.findFirst({
        where: {
            id,
            tenantId,
        },
    });

    if (!user) {
        throw new Error("User not found.");
    }

    if (user.role === UserRole.ENTERPRISE) {
        throw new Error("Cannot delete Enterprise user.");
    }

    if (currentUserId === id) {
        throw new Error("You cannot delete your own account.");
    }

    if (user.role === UserRole.ADMIN) {
        const adminCount = await prisma.user.count({
            where: {
                tenantId,
                role: UserRole.ADMIN,
            },
        });

        if (adminCount <= 1) {
            throw new Error("Cannot delete the last Admin of this company.");
        }
    }

    try {
        await adminAuth.deleteUser(id);
    } catch (error) {
        console.error(error);
        throw new Error("Unable to delete Firebase user.");
    }

    await prisma.user.delete({
        where: { id, },
    });

    return {
        message: "User deleted successfully.",
    };
}