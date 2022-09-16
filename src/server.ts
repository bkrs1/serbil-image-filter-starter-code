import express from 'express';
import bodyParser from 'body-parser';
import { Router, Request, Response } from 'express';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  app.get('/filteredimage', async (req: Request, res: Response)=>{
    const image_url = req.query.image_url.toString();
    //On se rassure que l'utilisateur a entré une URL
    if(!image_url){
      res.status(400).send('Une Url est requise');
    }

 //si l'utilisateur une url mal formée, on renvoit le code 400 avec le message y afférent
 if ( image_url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) !=null ) {
  return res.status(400)
            .send(`Inscrivez une URL valide`);
  }

    const filtered_image = await filterImageFromURL(image_url);

    res.status(200).sendFile(filtered_image, () =>{
      deleteLocalFiles([filtered_image]);
    });
    

  });



  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();