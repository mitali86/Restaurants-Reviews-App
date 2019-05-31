const cacheName = 'restaurantMap';
//Call Install Event

self.addEventListener('install', event => {
    console.log('Service Worker: Installed');
    event.waitUntil(
        caches
        .open('restaurantMap')
        .then(cache => {
            console.log('Service Worker: Caching Files');
            return  cache.addAll([
                '/index.html',
                '/restaurant.html',
                '/js/main.js',
                '/js/restaurant_info.js',
                '/js/dbhelper.js',
                '/img/1.jpg',
                '/img/2.jpg',
                '/img/3.jpg',
                '/img/4.jpg',
                '/img/5.jpg',
                '/img/6.jpg',
                '/img/7.jpg',
                '/img/8.jpg',
                '/img/9.jpg',
                '/img/10.jpg',
                '/data/restaurants.json',
                // '/css/media-query.css',
                '/css/media-query-reviews.css',
                '/css/styles.css'
             ]);
        })
        .then(() => self.skipWaiting())
    );
});

//Call Activate Event

self.addEventListener('activate', event => {
    console.log('Service Worker: Activated');
    //Remove unwanted caches
    event.waitUntil(
        caches.keys()
        .then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cacheName) {
                        console.log('Service Worker: Deleting Old Cache');
                        return caches.delete(cache);
                    }

                })

            );


        })

    );

});


//Call Fetch Event (Fetching the entire Site)

self.addEventListener('fetch', event => {
    console.log('Service Worker: Fetching from Cache');
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                console.log('Found ', event.request, ' in cache');
                return response;

            } else {
                return fetch(event.request)
                    .then(response => {
                        const responseClone = response.clone();
                        caches.open(cacheName)
                            .then(cache => {
                                cache.put(event.request, responseClone);
                            })
                        return response;

                    })
                    .catch((err) => {
                      console.log("Fetching is failed", err);
                    });
            }
        })

    );
    // save to cache files that were not placed there during service worker installation
    //this is mainly for map files. when user uses the app offline will now have access to
    // map images for restaurants pages he visited in the past network connection

    caches.match(event.request).then(response => {
      if(!response){
        // if response is not found in cache get if again from network and save it in caches
        fetch(event.request).then(response => {
          // do this by using the reference to current cache property
          self.currentCache.put(event.request, response);
        });
      }
    });
});
