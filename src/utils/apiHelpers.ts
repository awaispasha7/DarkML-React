/**
 * Helper function to fetch data from API with fallback to dummy data
 */
export async function fetchWithFallback<T>(
  apiCall: () => Promise<T>,
  dummyData: T
): Promise<T> {
  try {
    const result = await apiCall();
    // Check if result is paginated (has 'results' property)
    if (result && typeof result === 'object' && 'results' in result) {
      const paginated = result as { results: unknown[] };
      if (Array.isArray(paginated.results) && paginated.results.length > 0) {
        return result;
      }
    }
    // If result is an array and has items, return it
    if (Array.isArray(result) && result.length > 0) {
      return result;
    }
    // If result is an object (not array) and not empty, return it
    if (result && typeof result === 'object' && !Array.isArray(result) && Object.keys(result).length > 0) {
      return result;
    }
    // Otherwise, fall back to dummy data
    console.warn('API returned empty result, using dummy data');
    return dummyData;
  } catch (error: unknown) {
    console.warn('API call failed, using dummy data:', error);
    return dummyData;
  }
}

/**
 * Extract results from paginated API response
 */
export function extractResults<T>(data: unknown): T[] {
  if (data && typeof data === 'object' && 'results' in data) {
    const paginated = data as { results: T[] };
    return Array.isArray(paginated.results) ? paginated.results : [];
  }
  if (Array.isArray(data)) {
    return data;
  }
  return [];
}

