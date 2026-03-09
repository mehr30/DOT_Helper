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
    companyId?: string;
}

const STORAGE_KEY = "dot_helper_saved_documents";

export function getSavedDocuments(companyId?: string): SavedDocument[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const docs: SavedDocument[] = raw ? JSON.parse(raw) : [];
        if (!companyId) return docs;
        // Strictly filter to docs belonging to this company only
        return docs.filter(d => d.companyId === companyId);
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

export function getDocumentByFormId(formId: string, companyId?: string): SavedDocument | undefined {
    return getSavedDocuments(companyId).find(d => d.formId === formId);
}
