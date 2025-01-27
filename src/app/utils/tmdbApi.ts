
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_API_URL
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY

const fetchFromTMDB = async(endpoint: string, queryParams = "") => {

    try{
        const response = await fetch(
            `${BASE_URL}${endpoint}?api_key=${API_KEY}&language=en-US${queryParams}`,
            {
                headers: {
                    accept: "application/json",
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
                }
            }
        );

        if (!response.ok){
            throw new Error(`Error fetching data from ${endpoint}`)
        }
        return response.json();


    }catch(error){
        console.error("API Fetch Error:", error);
        return null;
    }
};

export const getPopularMovies = () => 
    fetchFromTMDB("/movie/popular");

export const getMovieDetails = (movieId:number) => 
    fetchFromTMDB(`/movie/${movieId}`)

export const getMoviesByGenre = (genreId:number) => 
    fetchFromTMDB("/discover/movie", `&with_genres=${genreId}`)

export const searchMovies = (query:string) => 
    fetchFromTMDB("/search/movie", `&query=${encodeURIComponent(query)}`)