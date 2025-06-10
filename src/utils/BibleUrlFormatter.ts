import { BOOK_MAP, VERSION_MAP } from "../constants"; // Import the book name mapping

export function formatBibleUrl( bookName: string, verse: string, version: string ): string| null {
    const versionID = VERSION_MAP[ version ] || VERSION_MAP[ "NIV" ]; // Default to NIV if not found
    const formattedPath = `${ bookName }.${ verse.replace( ":", "." ) }`; // Bible.com format
    const url = `https://www.bible.com/bible/${ versionID }/${ formattedPath }`;

    return url;
}

export function getUrlSafeBookName( bookName: string ): string | null {
    return BOOK_MAP[ bookName ] || null; // Return the URL-safe book name or null if not found
}