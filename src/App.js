import React, { useEffect, useState, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Gallery from 'react-photo-gallery';
import Carousel, { Modal, ModalGateway } from 'react-images';
import $ from 'jquery';
import './App.css';

const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;

export default function App() {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('nature');
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
  // &per_page=${page == (1 || 2) ? 10 :50}
  function getPhotos() {
    return fetch(`https://api.unsplash.com/search/photos?query=${query}&page=${page}&client_id=${accessKey}`)
      .then((res) => res.json())
      .then(({ results }) => {
        const newImages = results.map((image) => ({
          ...image,
          className: 'image',
          id: image.id,
          width: image.width,
          height: image.height,
          src: image.urls.regular,
          title: image.user.name,
        }));
        return newImages;
      });
  }
  function nextPage(){
    setPage((page) => page + 1)
  }

  function updatePhotos() {
    getPhotos().then((newImages) => {
      if (images.length) {
        setImages((images) => {
          const updatedImages = [
            ...[...images, ...newImages].filter(
              (image, i, arr) => i == arr.findIndex((el) => el.id == image.id)
            ),
          ];
          if (images.length == updatedImages.length) nextPage();
          return updatedImages;
        });
      } else {
        setImages(newImages);
      }
      if(page == 1)nextPage();
    });
  }

  useEffect(() => {
    updatePhotos();
  }, [page]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    setPage(1);
    setImages([]);
    updatePhotos();
  }

  return (
    <div className='app'>
      <h1>Ансплэш</h1>

      <form onSubmit={handleSearchSubmit}>
        <input
          type='text'
          placeholder='Search Unsplash...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button>Search</button>
      </form>

      <InfiniteScroll
        dataLength={images.length}
        next={nextPage}
        hasMore={true}
        loader={<button onClick={nextPage}>Ещё...</button>}
        className="infinite-scroll"
      >
        {images.length ? <Gallery  photos={images} direction={"column"} margin={15} onClick={openLightbox} /> : null}
        <ModalGateway>
          {viewerIsOpen ? (
            <Modal onClose={closeLightbox}>
              <Carousel
                currentIndex={currentImage}
                views={images.map((x) => ({
                  ...x,
                  srcset: x.srcSet,
                  caption: x.title,
                }))}
              />
            </Modal>
          ) : null}
        </ModalGateway>
      </InfiniteScroll>
    </div>
  );
}
