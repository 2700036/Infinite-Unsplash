import React, { useEffect, useState, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Gallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";
import './App.css';

// NOTE: make sure to add your unsplash api key
// https://unsplash.com/developers
// copy .env.example to .env
const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;

export default function App() {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);

  const openLightbox = useCallback((event, { photo, index }) => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  }, []);

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };

  useEffect(() => {
    getPhotos();
    // eslint-disable-next-line
  }, [page]);

  function getPhotos() {
    let apiUrl = `https://api.unsplash.com/photos?`;
    if (query) apiUrl = `https://api.unsplash.com/search/photos?query=${query}`;
    apiUrl += `&page=${page}`;
    apiUrl += `&client_id=${accessKey}`;

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        const imagesFromApi = data.results ?? data;
        const imagesWithSrc = imagesFromApi.map(image=>({class: "image", width: image.width, height: image.height, src: image.urls.regular, title: image.user.name}))
        // if page is 1, then we need a whole new array of images
        if (page === 1) {
          setImages(imagesWithSrc);
          return;
        }

        // if page > 1, then we are adding for our infinite scroll
        setImages((images) => [...images, ...imagesWithSrc]);
      });
  }

  function searchPhotos(e) {
    e.preventDefault();
    setPage(1);
    getPhotos();
  }


  return (
    <div className="app">
      <h1>Unsplash Image Gallery!</h1>

      <form onSubmit={searchPhotos}>
        <input
          type="text"
          placeholder="Search Unsplash..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button>Search</button>
      </form>

      <InfiniteScroll
        dataLength={images.length}
        next={() => setPage((page) => page + 1)}
        hasMore={true}
        loader={<h4>Loading...</h4>}
      >
        <Gallery photos={images} margin={15} onClick={openLightbox} />
      <ModalGateway>
        {viewerIsOpen ? (
          <Modal onClose={closeLightbox}>
            <Carousel
              currentIndex={currentImage}
              views={images.map(x => ({
                ...x,
                srcset: x.srcSet,
                caption: x.title
              }))}
            />
          </Modal>
        ) : null}
      </ModalGateway>
        
          
       
      </InfiniteScroll>
    </div>
  );
}
