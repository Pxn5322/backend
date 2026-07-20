export function findRelevantKnowledge(knowledge: { title: string; content: string; }[], query: string, limit = 5) {
    const keywords = query.toLowerCase().split(/\s+/);

    return knowledge.map(item => {
        const text = (item.title + " " + item.content).toLowerCase();
        let score = 0;

        keywords.forEach(word => {
            if (text.includes(word)) {
                score++;
            }
        });

        return { ...item, score, };
    }).sort((a, b) => b.score - a.score).slice(0, limit);
}