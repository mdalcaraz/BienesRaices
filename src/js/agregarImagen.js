import { Dropzone } from "dropzone";
const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')


Dropzone.options.imagen = {
    dictDefaultMessage: ' Arrastra tus imagenes aqui',
    acceptedFiles: '.png,.jpg,.jpeg',
    maxFilesieze: 5,
    maxFiles: 1,
    paralellUploads: 1,
    autoProcessQueue: false,
    addRemoveLinks: true,
    dictRemoveFile: 'Borrar archivo',
    dictMaxFilesExceeded: 'El limite es un archivo',
    headers: {
        'CSRF-Token': token
    },
    paramName: 'imagen',
    init: function () {
        const dropzone = this
        const btnPublicar = document.getElementById('publicar')

        btnPublicar.addEventListener('click', function () {
             dropzone.processQueue()
        })

        dropzone.on('queuecomplete', function() {
            if(dropzone.getActiveFiles().length == 0){
                window.location.href = '/mis-propiedades'
            }
        })
    }
}