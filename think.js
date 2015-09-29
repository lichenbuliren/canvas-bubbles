function loop() {
    render();
    calculate();
    clear();
    setTimeout(loop, 20);
}