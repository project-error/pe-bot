import fetch from 'node-fetch';

export default async function getImg() {
  let image;
  do {
    const parse = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?api_key=${
        process.env.NASAKEY
      }&sol=${Math.floor(Math.random() * 999)}`
    );
    const parsedJSON = await parse.json();
    image = parsedJSON.photos[0];
  } while (!image);
  return image.img_src;
}
