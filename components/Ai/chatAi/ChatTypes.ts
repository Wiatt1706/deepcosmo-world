type Message = {
    text: string;
};

type ChatMessage = {
    parts: Message[];
    role: string;
};

export type { ChatMessage };
