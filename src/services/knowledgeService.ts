import { prisma } from "../lib/prisma";

export async function getKnowledgeList(tenantId: string) {
    return prisma.knowledgeBase.findMany({
        where: { tenantId, },
        orderBy: { createdAt: "desc", },
    });
}

export async function getKnowledge(tenantId: string, id: string) {
    return prisma.knowledgeBase.findFirst({
        where: { id, tenantId, },
    });
}

export async function createKnowledge(tenantId: string, title: string, content: string) {
    return prisma.knowledgeBase.create({
        data: { tenantId, title, content, },
    });
}

export async function updateKnowledge(tenantId: string, id: string, data: { title?: string; content?: string; }) {
    const article = await prisma.knowledgeBase.findFirst({
        where: { id, tenantId, },
    });

    if (!article) {
        throw new Error("Knowledge article not found");
    }

    return prisma.knowledgeBase.update({
        where: { id, },
        data,
    });
}

export async function deleteKnowledge(tenantId: string, id: string) {
    const article = await prisma.knowledgeBase.findFirst({
        where: { id, tenantId, },
    });

    if (!article) {
        throw new Error("Knowledge article not found");
    }

    return prisma.knowledgeBase.delete({
        where: { id, },
    });
}