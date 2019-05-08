// Initialize Terminal
const term = new Terminal();

// Apply Addons
Terminal.applyAddon(attach);
Terminal.applyAddon(fit);
Terminal.applyAddon(winptyCompat);
term.winptyCompatInit();

// Open Terminal
const container = document.getElementById("terminal");
term.open(container);

term.prompt = () => {
  term.write("\r\n$ ");
};

loadWelcomeMessage();
loadWelcomeMenu();

// On selection
term.on("key", function(key, ev) {
  // Option 1: Open
  if (ev.keyCode === 49) {
    tryMenuOption("open");
  } else if (ev.keyCode === 50) {
    // Option 2: Create
    tryMenuOption("create");
  } else if (ev.keyCode === 51) {
    // Option 3: Import
    tryMenuOption("import");
  }
});

// Welcome Message
function loadWelcomeMessage() {
  term.writeln("Welcome to Clutch CLI 0.0.1 for TurtleCoin.");
}

// Welcome Menu
function loadWelcomeMenu() {
  term.writeln("");
  term.writeln("1) Open");
  term.writeln("2) Create");
  term.writeln("3) Import");
  term.writeln("");
  term.prompt();
}

// Send methods to server and respond
function tryMenuOption(action) {
  // Open the websocket connection to the backend
  const protocol = location.protocol === "https:" ? "wss://" : "ws://";
  const port = location.port ? `:${location.port}` : "";
  const socketUrl = `${protocol}${location.hostname}${port}/${action}`;
  const socket = new WebSocket(socketUrl);

  // Attach the socket to the terminal
  socket.onopen = ev => {
    term.attach(socket);
  };

  socket.onclose = ev => {
    loadMenuOptions();
  };
}
