// importamos la función createApp de vue
const { createApp } = Vue

// creamos una nueva instancia de la aplicación Vue
const app = createApp({
    // definimos los datos de nuestra aplicación, propiedades reactivas
    data() {
        return {
            getEvents: '../data/amazing.json', // URL del archivo JSON con los eventos
            events: [], // array con todos los eventos            
            mostAttendance: '', // variable para almacenar el evento con mayor asistencia           
            lowestAttendance: '', // variable para almacenar el evento con menor asistencia           
            largeCapacity: '', // variable para almacenar el evento con mayor capacidad            
            categories: [], // array con las categorías de los eventos            
            pastEvents: [], // array que almacena los eventos pasados            
            upcomingEvents: [], // array que almacena los eventos futuros            
            revenues: 0, // variable para almacenar las ganancias            
            attendacePercentage: 0, // variable para almacenar el porcentaje de asistencia

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
                    this.events = data.events // almacenamos los eventos en el array
                    let currentDate = data.currentDate // almacenamiento de la fecha actual
                    // filtrado de eventos pasados
                    this.pastEvents = this.events.filter(event => event.date < currentDate)
                    this.upcomingEvents = this.events.filter(event => event.date > currentDate)
                    // cálculo del evento con mayor asistencia
                    this.mostAttendance = this.eventWithMostAssistance(this.events)
                    // cálculo del evento con menor asistencia
                    this.lowestAttendance = this.eventWithLowestAssistance(this.events)
                    // cálculo del evento con mayor capacidad
                    this.largeCapacity = this.eventWithLargestCapacity(this.events)
                })
                .catch(error => console.error(error)) // si ocurre un error se muestra en consola
        },
        eventWithMostAssistance(events) {
            // se hace una copia del array original
            const sortedEvents = events.slice();
            // se ordena el array de eventos en orden descendente
            sortedEvents.sort((eventA, eventB) => {
                // se obtiene la asistencia o estimación, y se establece en 0 si no está definido
                let attendanceA = eventA.assistance || eventA.estimate || 0;
                let attendanceB = eventB.assistance || eventB.estimate || 0;
                // se calcula el porcentaje de capacidad
                let percentageA = (attendanceA / eventA.capacity) * 100;
                let percentageB = (attendanceB / eventB.capacity) * 100;
                // se resta el porcentaje de capacidad de eventB al porcentaje de eventA
                return percentageB - percentageA;
            });
            // se devuelve el nombre del primer evento en el array ordenado
            return sortedEvents[0].name;
        },
        eventWithLowestAssistance(events) {
            // se hace una copia del array original
            const sortedEvents = events.slice();
            // se ordena el array de eventos en orden ascendente
            sortedEvents.sort((eventA, eventB) => {
                // se obtiene la asistencia o estimación, y se establece en 0 si no está definido
                let attendanceA = eventA.assistance || eventA.estimate || 0;
                let attendanceB = eventB.assistance || eventB.estimate || 0;
                // se calcula el porcentaje de capacidad
                let percentageA = (attendanceA / eventA.capacity) * 100;
                let percentageB = (attendanceB / eventB.capacity) * 100;
                // se resta el porcentaje de capacidad de eventA al porcentaje de eventB
                return percentageA - percentageB;
            });
            // se devuelve el nombre del primer evento en el array ordenado
            return sortedEvents[0].name;
        },
        eventWithLargestCapacity(events) {
            // se hace una copia del array original
            let sortedEvents = events.slice();
            // se ordena el array en orden descendente de acuerdo a la capacidad
            sortedEvents.sort((a, b) => {
                return b.capacity - a.capacity;
            });
            // se devuelve el nombre del primer evento con mayor capacidad
            return sortedEvents[0].name;
        },
        getCategories(events) {
            // array vacío para almacenar las categorías
            this.categories = []
            // iterar sobre cada evento del array
            events.forEach(event => {
                // si la categoría del evento no está incluida en categories
                // se agrega la categoría al array con push
                if (!this.categories.includes(event.category)) {
                    this.categories.push(event.category)
                }
            })
        },
        calculateRevenues(category, array) {
            // filtrar el array de eventos para obtener solo los eventos de la categoría especificada
            const arrayFiltered = array.filter((event) => event.category === category)
            // calcular los ingresos de cada evento y se almacenan en un nuevo array
            const revenues = arrayFiltered.map((event) => {
                // el precio se multiplica por la asistencia si existe, sino se utiliza
                // la estimación 0
                return event.price * (event.assistance || event.estimate || 0)
            });
            // sumar los ingresos de todos los eventos para obtener el total de
            // ingresos de la categoría
            this.revenues = revenues.reduce((total, revenue) => total + revenue, 0);
        },
        calculateAttendancePercentage(category, array) {
            // se filtran los eventos que corresponden a la categoría
            const arrayFiltered = array.filter((event) => event.category === category)
            // se utiliza reduce para sumar la asistencia de todos los eventos filtrados
            // y se obtiene la capacidad total
            const { totalAssistance, capacity } = arrayFiltered.reduce((accumulator, event) => {
                // se calcula la asistencia para el evento actual, tomando en cuenta
                // primero el valor de assistance y si no existe, el de estimate
                const assistance = event.assistance ?? event.estimate ?? 0
                return {
                    // se actualiza el acumulador sumando la asistencia del evento actual
                    // a la asistencia total acumulada
                    totalAssistance: accumulator.totalAssistance + assistance,
                    // se actualiza el acumulador sumando la capacidad del evento actual
                    // a la capacidad total acumulada
                    capacity: accumulator.capacity + event.capacity,
                };
            }, { totalAssistance: 0, capacity: 0 });
            // se calcula el porcentaje de asistencia dividiendo la asistencia total
            // entre la capacidad total y multiplicando por 100
            this.attendancePercentage = ((totalAssistance / capacity) * 100).toFixed(2);
        }

    },
    // definimos las propiedades computadas
    computed: {

    }
}).mount('#app') // monta la aplicación en el elemento HTML