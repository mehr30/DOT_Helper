// Saved Documents — localStorage-based document store
// Used by the Document Wizard to save completed forms and by the Documents page to display them

export interface SavedDocument {
    id: string;
    formId: string;
    title: string;
    shortTitle: string;
    category: "driver" | "vehicle" | "company" | "safety";
    cfrReference: string;
    data: Record<string, string | boolean>;
    savedAt: string; // ISO date string
    completedFields: number;
    totalFields: number;
    status: "draft" | "completed";
}

const STORAGE_KEY = "dot_helper_saved_documents";

export function getSavedDocuments(): SavedDocument[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export function saveDocument(doc: SavedDocument): void {
    const docs = getSavedDocuments();
    const existingIndex = docs.findIndex(d => d.id === doc.id);
    if (existingIndex >= 0) {
        docs[existingIndex] = doc;
    } else {
        docs.push(doc);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
}

export function deleteDocument(id: string): void {
    const docs = getSavedDocuments().filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
}

export function getDocumentByFormId(formId: string): SavedDocument | undefined {
    return getSavedDocuments().find(d => d.formId === formId);
}
