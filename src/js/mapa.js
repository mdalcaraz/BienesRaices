(function () {

    const lat = document.querySelector('#lat').value || -32.924530;
    const lng = document.querySelector('#lng').value || -68.802390;
    const mapa = L.map('mapa').setView([lat, lng], 16);
    let marker;

    //Utilizar provider y geocoder
    const geocodeService = L.esri.Geocoding.geocodeService()

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //El pin
    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    }).addTo(mapa);

    //detectar el movimiento

    marker.on('moveend', function (e) {
        marker = e.target
        const posicion = marker.getLatLng();
        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng))
        //Obtener calle y numeracion
        geocodeService.reverse().latlng(posicion, 16).run(function (error, resultado) {
            marker.bindPopup(resultado.address.LongLabel).openPopup();
            //Lenar los campos
            document.querySelector('.calle').textContent = resultado?.address?.Address ?? '';
            document.querySelector('#calle').value = resultado?.address?.Address ?? '';
            document.querySelector('#lat').value = resultado?.latlng?.lat ?? '';
            document.querySelector('#lng').value = resultado?.latlng?.lng ?? '';
        })

    })

})()