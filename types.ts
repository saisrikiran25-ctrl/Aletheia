export enum AppPhase {
  IDLE = 'IDLE',
  SCANNING = 'SCANNING',
  SKEPTIC = 'SKEPTIC',
  SYNTHESIS = 'SYNTHESIS',
  COMPLETE = 'COMPLETE',
}

export interface LogEntry {
  id: string;
  agent: 'CONSENSUS' | 'SKEPTIC' | 'SYNTHESIZER' | 'SYSTEM';
  message: string;
  timestamp: number;
}

export interface AnalysisResult {
  consensus: {
    theme: string;
    points: string[];
    marketSaturation: number; // 0-100
  };
  skeptic: {
    fallacies: string[];
    stagnationPoint: string;
    mimeticTraps: string[];
  };
  synthesis: {
    secret: string;
    verticalStrategy: string;
    opportunityScore: number; // 0-100
  };
  sources?: { title: string; uri: string }[];
}

export interface HeatmapPoint {
  x: number;
  y: number;
  z: number;
  intensity: number;
}