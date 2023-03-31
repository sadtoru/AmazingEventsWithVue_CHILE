// importamos la función createApp de vue
const { createApp } = Vue

// creamos una nueva instancia de la aplicación Vue
const app = createApp({
    // definimos los datos de nuestra aplicación, propiedades reactivas
    data() {
        return {
            getEvents: '../data/amazing.json', // URL del archivo JSON con los eventos
            largeCardDetail: [], // propiedad de datos que se inicializa como una matriz vacía
        }
    },
    // hook de ciclo de vida que se ejecuta inmediatamente después de que se crea una
    // instancia de la aplicación Vue
    created() {
        this.getData() // obtenemos los datos de los eventos
    },
    // método que se ejecuta cuando la instancia de la aplicación es montada en el DOM
    mounted() {
    },
    // definimos los métodos de nuestra aplicación
    methods: {
        // obtiene los datos de los eventos del archivo JSON
        getData() {
            fetch(this.getEvents) // hacemos una petición a la URL declarada arriba
                .then(response => response.json()) // convertimos la respuesta en JSON
                .then(data => {
                    // obtener el id del evento de la URL
                    let queryString = location.search
                    let param = new URLSearchParams(queryString)
                    let eventId = param.get('id')
                    // buscar el evento en la data según su id
                    this.largeCardDetail = data.events.find(card => card._id == eventId)
                })
                .catch(error => console.error(error)) // si ocurre un error se muestra en consola
        },
    },
    // definimos las propiedades computadas
    computed: {

    }
}).mount('#app') // monta la aplicación en el elemento HTML


