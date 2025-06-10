import { Notice } from "obsidian";

export async function fetchVerse( book: string, chapter: string ): Promise<any> {
    try {
        // KJV uses a different API endpoint
        const query = encodeURIComponent( book + "/" + chapter );
        const url = `https://bible-api.com/data/web/${ query }`;
        const response = await fetch( url );

        if ( !response.ok ) {
            throw new Error( `HTTP error! status: ${ response.status }` );
        }

        const data = await response.json();
        return data || null;
    } catch ( error ) {
        console.error( "Error fetching verse:", error );
        new Notice( "Failed to fetch verse. Please check your internet connection." );
        return null;
    }
}