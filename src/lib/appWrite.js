import { Client, Databases, ID, Query } from 'appwrite';


const projectId = import.meta.env.VITE_PROJECT_ID
const dataBaseId = import.meta.env.VITE_DATABASE_ID
const collectionId = import.meta.env.VITE_COLLECTION_ID

const client = new Client();

client.setProject(projectId);


const database = new Databases(client);


export const updateSearchCount = async (searchTrem, movie) => {
    // 1 fetch lis document for corresponsing search terms

    console.log(movie)

    try {
        const docs = await database.listDocuments(dataBaseId, collectionId,
            [Query.equal('searchTrem', searchTrem)]);

        if (docs.documents.length > 0) {

            const movie = docs.documents[0];
            await database.updateDocument(dataBaseId, collectionId, movie.$id,
                {
                    countSearch: movie.countSearch + 1,
                }
            )

        } else {

            await database.createDocument(dataBaseId, collectionId, ID.unique(), {
                searchTrem,
                countSearch: 1,
                poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
                movie_id: movie.id
            })

        }


    } catch (error) {
        console.log("ERROR updateSearchCount :", error.message);
    }

}

export const getTrendingMovie = async ()=>{
    try {
        const resulte = await database.listDocuments(dataBaseId,collectionId,
            [Query.limit(5) , Query.orderDesc('countSearch')]
        )

        return resulte.documents;
    } catch (error) {
        
    }
}