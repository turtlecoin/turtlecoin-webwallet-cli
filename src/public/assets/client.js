// Initialize Terminal
const term = new Terminal({
  convertEol: true,
  cursorBlink: true,
  cursorStyle: "block",
  scrollback: 1000,
  debug: true,
  tabStopWidth: 8
});

// Apply Addons
Terminal.applyAddon(attach);
Terminal.applyAddon(fit);
Terminal.applyAddon(winptyCompat);

// Open Terminal
const container = document.getElementById("terminal");
term.open(container);
term.winptyCompatInit();
term.fit();

// Set Terminal Prompt
term.prompt = () => {
  setTimeout(function() {
    term.write("\r\n$ ");
  }, 1000);
};

// Start
welcomeMessage();
startMenu();

// Routes
term.on("key", function(key, ev) {
  // Option 1: Open
  if (ev.keyCode === 49) {
    tryMethod("open");
  } else if (ev.keyCode === 50) {
    // Option 2: Create
    tryMethod("create");
  } else if (ev.keyCode === 51) {
    // Option 3: Import
    tryMethod("import");
  }

  // Write input
  term.write(key);
});

// Welcome Message
function welcomeMessage() {
  term.writeln("Welcome to Clutch CLI 0.0.1 for TurtleCoin.");
}

// Start Menu
function startMenu() {
  term.writeln("");
  term.writeln("1) Open");
  term.writeln("2) Create");
  term.writeln("3) Import");
  term.writeln("");
  term.prompt();
}

// Send methods to server and respond
function tryMethod(action) {
  // Open the websocket connection to the backend
  const protocol = location.protocol === "https:" ? "wss://" : "ws://";
  const port = location.port ? `:${location.port}` : "";
  const url = `${protocol}${location.hostname}${port}/${action}`;
  const socket = new WebSocket(url);

  // Attach the socket to the terminal
  socket.onopen = ev => {
    term.attach(socket, true, true);
  };

  // Display Prompt after message
  socket.onmessage = ev => {
    term.prompt();
  };

  socket.onclose = ev => {};
}
