    const cvs = document.getElementById("c");
    const ctx = cvs.getContext("2d");
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 5;
    const f = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800];
    var a = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    var b = [ , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    var c = [ , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var last = 0, elapsed, start;
    var translate = {x: 0, y: 0}
    let p = new Path2D('m 90 0 h 150 v 250 h 75 l -150 150 l -150 -150 h 75 z');
    
    const goal = 200000;
    
    function buy(n) {
    	if (a[0] >= Math.floor(c[n])) {
        	a[0] -= Math.floor(c[n]);
            a[n]++;
            b[n]++;
        }
    }
    function attemptBuy(n) {
    	switch (n.code.slice(0,4)) {
        	case "Digi":
            	buy(parseInt(n.code.charAt(5)) || 10);
                break;
            case "KeyM":
            	for (let i = 1; i <= 10; i++) {
            		buy(i);
                }
            	break;
        }
    }
    document.addEventListener('keydown', attemptBuy);
    function end(time) {
    	elapsed = (time - last) / 1000;
        document.getElementById("L").style.visibility = "visible";
    	if (elapsed > 5.5) {
        	document.getElementById("G").style.visibility = "visible";
            if (elapsed > 6) {
            	document.getElementById("D").style.visibility = "visible";
            	if (elapsed > 6.5) {
                	ctx.clearRect(0, 0, 400, 400);
        			ctx.fillText("     : 1/500", 10, 20);
                    ctx.fill(p);
                    if (elapsed > 7) {
                    	document.getElementById("msg").innerHTML = "You win!";
                    	if (elapsed > 7.5) {
                    		document.getElementById("msg").innerHTML = `You win! (Time: ${document.getElementById("timer").innerHTML.slice(0,-59)} seconds`;
                            return;
                    	}
                    }
            	}
            }
        }
        requestAnimationFrame(end);
    }
    
    function win(time) {
    	elapsed = (time - last) / 1000;
        
    	ctx.clearRect(0, 0, 500, 500);
        ctx.font = "bold 500px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("A", cvs.width / 2 + translate.x, cvs.height + translate.y);
        ctx.font = "bold 15px monospace";
        ctx.textAlign = "left";
        ctx.strokeText("     : 1/500", 10, 20);
        ctx.strokeText("Scale", 10 + translate.x, 20 + translate.y);
        ctx.fillText("     : 1/500", 10, 20);
        ctx.fillText("Scale", 10 + translate.x, 20 + translate.y);
        
        if (elapsed < 0.5) {
        	document.querySelector("body").style.transform = `translate(${(Math.random() - 0.5) * (100 - elapsed * 200)}px, ${(Math.random() - 0.5) * (100 - elapsed * 200)}px)`;
        } else {
        	document.querySelector("body").style.transform = "";
            if (elapsed > 1 && elapsed < 3) {
            	translate.x = (Math.random() - 0.5) * 5;
                translate.y = (Math.random() - 0.5) * 5;
                document.querySelectorAll(".letter").forEach(e => {
                	e.style.transform = `translate(${translate.x}px, ${translate.y}px)`;
                });
            } else if (elapsed > 3) {
            	translate.x = 0;
                translate.y = (elapsed - 3) * (elapsed - 3.5) * 1000;
                document.querySelectorAll(".letter").forEach(e => {
                	e.style.transform = `translate(${translate.x}px, ${translate.y}px)`;
                });
                if (elapsed > 5) {
                	document.querySelectorAll(".letter").forEach(e => {
                		e.style.transform = "";
                		e.style.visibility = "hidden";
                	});
                	requestAnimationFrame(end);
                    return;
                }
            }
        }
        requestAnimationFrame(win);
    }
    
    function draw(time) {
    	elapsed = (time - last) / 1000;
        last = time;
        if (start == undefined && a[1] > 0) {
        	start = time;
        }
        
    	ctx.clearRect(0, 0, 500, 500);
        ctx.font = "bold 500px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("A", cvs.width / 2, cvs.height + (a[0] - goal) / 500);
        ctx.font = "bold 15px monospace";
        ctx.textAlign = "left";
        ctx.strokeText("Scale: 1/500", 10, 20);
        ctx.fillText("Scale: 1/500", 10, 20);
        
        for (let i = 1; i <= 10; i++) {
        	for (let j = 0; j < i; j++) {
        		a[j] += elapsed ** (i - j) * a[i] / f[i - j];
        	}
        }
        
        document.getElementById("prog").innerHTML = goal - Math.floor(a[0]);
        document.getElementById("pos").innerHTML = Math.floor(a[0]);
        document.getElementById("vel").innerHTML = Math.floor(a[1]);
        document.getElementById("acc").innerHTML = Math.floor(a[2]);
        document.getElementById("jer").innerHTML = Math.floor(a[3]);
        document.getElementById("sna").innerHTML = Math.floor(a[4]);
        document.getElementById("cra").innerHTML = Math.floor(a[5]);
        document.getElementById("pop").innerHTML = Math.floor(a[6]);
        document.getElementById("loc").innerHTML = Math.floor(a[7]);
        document.getElementById("dro").innerHTML = Math.floor(a[8]);
        document.getElementById("sho").innerHTML = Math.floor(a[9]);
        document.getElementById("put").innerHTML = Math.floor(a[10]);
        
        for (let i = 1; i <= 10; i++) {
        	c[i] = 2 ** (i * 1.1 ** b[i] - 1);
            document.getElementById("u" + i).innerHTML = `Cost: ${Math.floor(c[i])} Position`;
            document.getElementById("u" + i).className = a[0] >= Math.floor(c[i]) ? "" : "nah"
        }
        
        if (start != undefined) {
        	document.getElementById("timer").innerHTML = ((time - start) / 1000).toFixed(3) + '<span class="letter">sec</span>';
        }
        if (a[0] < goal) {
    		requestAnimationFrame(draw);
        } else {
        	document.removeEventListener('keydown', attemptBuy);
        	for (let i = 1; i <= 10; i++) {
            	document.getElementById("u" + i).innerHTML = `<span class="letter">Cost</span>: ${Math.floor(c[i])} <span class="letter">Position</span>`;
            	document.getElementById("u" + i).classList.add("halt");
        	}
        	document.getElementById("prog").innerHTML = 0;
        	document.getElementById("pos").innerHTML = goal;
        	requestAnimationFrame(win);
        }
    }
    requestAnimationFrame(draw);
