// importamos la función createApp de Vue
const { createApp } = Vue

// creamos una nueva instancia de la aplicación Vue
const app = createApp({
  // definimos los datos de nuestra aplicación, propiedades reactivas
  data() {
    return {
      getEvents: '../data/amazing.json', // URL del archivo JSON con los eventos
      showPast: [], // array con los eventos pasados a mostrar
      events: [], // array con todos los eventos
      text: '', // texto de búsqueda inicializado en vacío
      categories: [], // array con las categorías de los eventos
      selectedCategories: [], // array con las categorías seleccionadas

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
          let currentDate = data.currentDate // almacenamiento de la fecha actual
          // filtramos los eventos pasados por fecha
          this.showPast = this.events.filter(event => event.date < currentDate)
          // obtenemos las categorías de los eventos
          this.getCategories(data.events)
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

  },
  // definimos las propiedades computadas
  computed: {
    // función que filtra los eventos según el texto de búsqueda y las categorías seleccionadas
    superFilter() {
      // filtramos por texto de búsqueda
      let filteredEvents = this.showPast.filter(event => event.name.toLowerCase().includes(this.text.toLowerCase()))
      // si hay categorías seleccionadas, filtramos por categoría
      if (this.selectedCategories.length > 0) {
        filteredEvents = filteredEvents.filter(event => this.selectedCategories.includes(event.category))
      }
      return filteredEvents
    }

  }
}).mount('#app') // monta la aplicación en el elemento HTML