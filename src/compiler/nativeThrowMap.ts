export interface ThrowMapEntry {
    throws?: string[];
    rejects?: string[];
}
export type ThrowMap = Record<string, ThrowMapEntry>;

export const NATIVE_THROW_MAP: ThrowMap = {
    "JSON.parse": { throws: ["SyntaxError"] },
    "JSON.stringify": { throws: ["TypeError"] },
    "decodeURI": { throws: ["URIError"] },
    "decodeURIComponent": { throws: ["URIError"] },
    "encodeURI": { throws: ["URIError"] },
    "encodeURIComponent": { throws: ["URIError"] },
    "URL": { throws: ["TypeError"] },
    "url.URL": { throws: ["TypeError"] },
    "URLSearchParams": { throws: ["TypeError"] },
    "url.URLSearchParams": { throws: ["TypeError"] },
    "fetch": { rejects: ["TypeError"] },
};
