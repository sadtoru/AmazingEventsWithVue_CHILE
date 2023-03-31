// importamos la función createApp de Vue
const { createApp } = Vue

// creamos una nueva instancia de la aplicación Vue
const app = createApp({
    // definimos los datos de nuestra aplicación, propiedades reactivas
    data() {
        return {            
            getEvents: '../data/amazing.json', // URL del archivo JSON con los eventos            
            showEvents: [], // array con los eventos a mostrar            
            events: [], // array con todos los eventos            
            text: '', // texto de búsqueda inicializado en vacío            
            categories: [], // array con las categorías de los eventos            
            selectedCategories: [], // array con las categorías seleccionadas            
            largeCardDetail: {}, // objeto con el detalle de un evento seleccionado            
            booleanDetails: false, // booleano que indica si se deben mostrar los detalles de un evento
            booleanCards: true, // booleano que indica si se deben mostrar las cards de los eventos

        }
    },
    // hook de ciclo de vida que se ejecuta inmediatamente después de que se crea una
    // instancia de la aplicación Vue
    created() {
        // obtenemos los datos de los eventos
        this.getData()
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
                    this.events = data.events // almacenamos los eventos en el array
                    this.showEvents = this.events // mostramos todos los eventos
                    this.getCategories(data.events) // obtenemos las categorías de los eventos

                })
                .catch(error => console.error(error)) // si ocurre un error se muestra en consola
        },
        // función que obtiene las categorías de los eventos
        getCategories(array) {
            // recorremos el array de eventos
            array.forEach(element => {
                // si la categoría del evento actual no se encuentra en el array de categorías
                if (!this.categories.includes(element.category)) {
                    // agregamos la categoría al array de categorías
                    this.categories.push(element.category)
                }
            })
        },
        // función que muestra los detalles de un evento
        goToDetails(id) {
            // obtenemos los detalles del evento seleccionado
            this.largeCardDetail = this.cards.find(card => card._id == id),
                // ocultamos las cards de los eventos
                this.booleanCards = false,
                // mostramos los detalles del evento
                this.booleanDetails = true
        },
        // función que se encarga de volver a la página principal
        goHome() {
            this.booleanDetails = false, // ocultamos los detalles del evento
                this.booleanCards = true // mostramos las cards de los eventos
        }

    },
    // definimos las propiedades computadas
    computed: {
        // función que filtra los eventos según el texto de búsqueda y las categorías seleccionadas
        superFilter() {
            // filtramos por texto de búsqueda
            let firstFilter = this.events.filter(event => event.name.toLowerCase().includes(this.text.toLowerCase()))
            if (!this.selectedCategories.length) {
                // si no hay categorías seleccionadas mostramos todos los eventos
                // que coincidan con el texto de búsqueda
                this.showEvents = firstFilter
            } else {
                // si hay categorías seleccionadas filtramos los eventos que coinciden
                // con las categorías seleccionadas y con el texto de búsqueda
                this.showEvents = firstFilter.filter(event => this.selectedCategories.includes(event.category))
            }
        },

    }
}).mount('#app') // monta la aplicación en el elemento HTML