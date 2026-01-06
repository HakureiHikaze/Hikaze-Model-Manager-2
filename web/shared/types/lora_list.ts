export interface LoRAEntry {
    full_path: string;
    strength_model: number;
    strength_clip: number;
    enabled: boolean;
    name: string;
    sha256: string;
}

export interface LoRAListDocument {
    version: number;
    loras: LoRAEntry[];
}
