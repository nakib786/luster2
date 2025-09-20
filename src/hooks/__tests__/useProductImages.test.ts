import { renderHook, waitFor } from '@testing-library/react';
import { useProductImages } from '../useProductImages';

// Mock fetch
global.fetch = jest.fn();

describe('useProductImages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch product images successfully', async () => {
    const mockProducts = {
      success: true,
      data: {
        products: [
          {
            id: '1',
            name: 'Test Product 1',
            media: {
              main: {
                image: 'https://example.com/image1.jpg'
              },
              itemsInfo: {
                items: [
                  {
                    image: 'https://example.com/image2.jpg',
                    mediaType: 'IMAGE'
                  }
                ]
              }
            }
          }
        ]
      }
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockProducts,
    });

    const { result } = renderHook(() => useProductImages());

    expect(result.current.loading).toBe(true);
    expect(result.current.images).toEqual([]);
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.images).toHaveLength(2);
    expect(result.current.images[0]).toEqual({
      url: 'https://example.com/image1.jpg',
      alt: 'Test Product 1',
      productId: '1',
      productName: 'Test Product 1'
    });
    expect(result.current.error).toBe(null);
  });

  it('should handle API errors gracefully', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    const { result } = renderHook(() => useProductImages());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('API Error');
    expect(result.current.images).toHaveLength(4); // Fallback images
  });

  it('should provide refetch functionality', async () => {
    const mockProducts = {
      success: true,
      data: {
        products: []
      }
    };

    (fetch as jest.Mock).mockResolvedValue({
      json: async () => mockProducts,
    });

    const { result } = renderHook(() => useProductImages());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetch).toHaveBeenCalledTimes(1);

    // Call refetch
    result.current.refetch();

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });
});
