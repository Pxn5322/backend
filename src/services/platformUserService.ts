import { UserRole } from "../../generated/prisma";
import { adminAuth } from "../config/firebaseAdmin";
import { prisma } from "../lib/prisma";

export async function getAllUsers() {
    return prisma.user.findMany({
        orderBy: { createdAt: "desc", },
        include: {
            tenant: {
                select: {
                    id: true,
                    companyName: true,
                    companyCode: true,
                },
            },
        },
    });
}

export async function updatePlatformUser(id: string, data: { name: string; email: string; role: UserRole; }) {
    const user = await prisma.user.findUnique({
        where: { id, },
    });

    if (!user) {
        throw new Error("User not found");
    }

    if (user.role === UserRole.ENTERPRISE) {
        throw new Error("Enterprise account cannot be modified.");
    }

    const duplicated = await prisma.user.findFirst({
        where: {
            email: data.email,
            NOT: { id, },
        },
    });

    if (duplicated) {
        throw new Error("Email already exists.");
    }

    await adminAuth.updateUser(id, {
        email: data.email,
        displayName: data.name,
    });

    return prisma.user.update({
        where: { id, },
        data: {
            name: data.name,
            email: data.email,
            role: data.role,
        },
        include: { tenant: true, },
    });
}

export async function changePassword(id: string, password: string) {
    const user = await prisma.user.findUnique({
        where: { id, },
    });

    if (!user) {
        throw new Error("User not found");
    }

    if (user.role === UserRole.ENTERPRISE) {
        throw new Error("Enterprise password cannot be changed.");
    }

    await adminAuth.updateUser(
        id,
        { password, }
    );
}

export async function deletePlatformUser(id: string) {
    const user = await prisma.user.findUnique({
        where: { id, },
    });

    if (!user) {
        throw new Error("User not found");
    }

    if (user.role === UserRole.ENTERPRISE) {
        throw new Error("Cannot delete Enterprise account.");
    }

    try {
        await adminAuth.deleteUser(id);
    } catch {
        console.warn("Firebase user already removed.");
    }

    return prisma.user.delete({
        where: { id, },
    });
}