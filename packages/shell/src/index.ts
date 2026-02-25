// Async boundary — Module Federation requires the host entry
// to be asynchronous so remote containers can be initialised
// before any application code runs.
import('./bootstrap');
