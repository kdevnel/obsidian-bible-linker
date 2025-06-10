export function parseBibleReference( reference: string ): { bookName: string, verse: string; } | null {
    const match = reference.match( /^([1-3]?\s?[A-Za-z\s]+)\s(\d+:\d+(-\d+)?)$/ );

    if ( !match ) { return null };

    const parts = reference.split( /\s+/ );

    // Join all parts except the last one
    // This accounts for book names with numbers or multiple words
    const bookName = parts.slice( 0, -1 ).join( " " )
        .replace( / /g, "" ) // Remove spaces for URL safety
        .toLowerCase() // Convert to lowercase for mapping
        .replace( /1st|2nd|3rd/g, ( match ) => match.replace( /st|nd|rd/g, '' ) ); // Handle ordinal numbers
    const verse = parts[ parts.length - 1 ];

    return { bookName, verse };
}