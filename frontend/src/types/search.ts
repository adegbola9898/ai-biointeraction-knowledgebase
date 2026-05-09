export interface SearchHitSource {
  type: string;
  id: string;
  title?: string;
  abstractText?: string;
  proteinA?: string;
  proteinB?: string;
  interactionType?: string;
  evidenceText?: string;
  status?: string;
}

export interface SearchHit {
  _id: string;
  _score: number;
  _source: SearchHitSource;
}

export interface SearchResponse {
  hits: {
    hits: SearchHit[];
  };
}
