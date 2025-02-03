import { useDebounce } from 'react-use'
import { useState , useEffect} from 'react'
import Search from './components/Search'
import Spinner from './components/Spinner'
import MovieCard from './components/MovieCard'
import { getTrendingMovie, updateSearchCount } from './lib/appWrite'

const  App = () =>  {
   
  const api_key = import.meta.env.VITE_TMBD_API_TOKEN
  const base_url = import.meta.env.VITE_BASE_URL

  const [searchTerm, setSearchTerm] = useState('')
  //using debonce for efficent search 
  const [debouncSearchTerms, setdebouncSearchTerms] = useState('');

  useDebounce(()=> setdebouncSearchTerms(searchTerm) , 1000 , [searchTerm])


  const [error, setError] = useState('')

const [movies, setMovies] = useState([]);

const [loading, setLoading] = useState(false)

const  [trendingMovie, setTrendingMovie] = useState([]);


  const api_optins={
    method  :'GET' ,
    headers : {
      accept: 'application/json',
      Authorization: `Bearer ${api_key}`
    }
  }

  const ftechData = async (searching = '')=>{
    try {

      // let query = '/discover/movie?sort_by=popularity.desc'
      
      let query = searching ? `/search/movie?query=${searching}`  : '/discover/movie?sort_by=popularity.desc';

      let endpoint = `${base_url}${query}`
      
      setLoading(true); 

      const response = await fetch(endpoint , api_optins)

      if(!response.ok) return setError('failed to fetch movies')

      
      const data = await response.json();

      if(!data.results) return setError('ther is no movies');

      setMovies(data.results || []);



      if(searching && data.results.length > 0 ){

        await updateSearchCount(searching , data.results[0] );

      }


      return ;
    } catch (error) {
      setError(error.message)
      console.log('ERROR : fetching movies' , error.message)
    } finally{
      setLoading(false);
    }
  }


  const loadTrendingMovie = async ()=>{
    try {
      const movies = await getTrendingMovie();

        setTrendingMovie(movies)
    } catch (error) {
      alert(error)
    }
  }
  useEffect(()=>{
    ftechData(debouncSearchTerms);
  },[debouncSearchTerms]);

  useEffect(()=>{
    loadTrendingMovie()
  },[]);


  return (
    <main>
      <div className='pattern w-full'/>
      <div className='wrapper'>

          <header>
            {/* logo */}

            <img src='/logo.png' className='h-10 w-10 mb-10'/>

            { /* image */}
            <img src='/hero.png'/>
          

            <h1>Find <span className='text-gradient'>Movie</span> that you will enjoy Day by Day</h1>

            <Search search={searchTerm} handlSearchTerm={setSearchTerm} />
          </header>

          {/* Trending movies section */}
          {trendingMovie.length > 0 ? (
            <section className='trending'>
              <h3 className='text-xl'>Trending <span className='text-gradient'>Movies</span></h3>
              <ul>
                {trendingMovie.map( (movie , index) => (
                  <li key={index}>
                    <p>{index + 1}</p>
                    <img 
                      src={movie.poster_url}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ) : (<p className='text-white'>No Trending Movies</p>)}

          {/* All movies section */}
          <section className='all-movies '>
              
              <h2 className='mt-10'>All <span className='text-gradient'>Movies</span> Are Her</h2>
              
              
              {loading ? (
                        <Spinner />
              ) : error ? ( <p className='text-red-500 text-2xl font-bold'>{error}</p>) :
              (
                //card Video
                <ul>
                  {movies.map( (movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </ul>
              )
              }

          </section>
      </div>
        
    </main>
  )
}

export default App
