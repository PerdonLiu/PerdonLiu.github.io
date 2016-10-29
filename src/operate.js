window.onload = function() {
    // 用于记录当前块的位置
    var squares = [["p0", "p1", "p2", "p3"], ["p4", "p5", "p6", "p7"], ["p8", "p9", "p10", "p11"], ["p12", "p13", "p14", "p15"]];
    // 用于记录空块的位置
    var originSq = [["p0", "p1", "p2", "p3"], ["p4", "p5", "p6", "p7"], ["p8", "p9", "p10", "p11"], ["p12", "p13", "p14", "p15"]];
    var space = {row: 3, col: 3};
    var main = document.getElementById("main");
    main.addEventListener("click", game);
    var start = document.getElementById("start");
    start.addEventListener("click", onstart);
    var parts = document.getElementsByClassName("part");
    var succeed = false;
    var begin = false;
    var show = document.getElementById("show");
    // 计算步数
    var count = 0;
    // 是否是计算机点击
    var computer = true;
    // 是否开始另一盘
    var another = true;
    // 控制难度
    var is_easy = true;
    var easy = document.getElementById("easy");
    easy.addEventListener("click", oneasy);
    var change = document.getElementById("change");
    change.addEventListener("click", onchange);
    // 标记图片
    var recover = document.getElementById("recover");
    recover.addEventListener("click", onrecover);
    var pic = 1;
    var img = document.getElementsByTagName("img")[0];
    function game(event) {
        console.log("a");
        if (begin == false)
            return;
        if (computer == false)
            count += 1;
        var block = document.getElementById("p15");
        var myclick = event.target;
        var myRow = Math.floor(myclick.dataset.value/4);
        var myCol = Math.floor(myclick.dataset.value%4);
        // 上下左右分清楚
        var myRight = { row: myRow, col: myCol+1 };
        var myLeft = { row: myRow, col: myCol-1 };
        var myTop = { row: myRow-1, col: myCol };
        var myBottom = { row: myRow+1, col: myCol };
        // 用于标记是否可以移动
        var flag = false;
        if ((isAvailable(myRight) && myRight.row === space.row && myRight.col === space.col)
            || (isAvailable(myLeft) && myLeft.row === space.row && myLeft.col === space.col)
            || (isAvailable(myTop) && myTop.row === space.row && myTop.col === space.col)
            || (isAvailable(myBottom) && myBottom.row === space.row && myBottom.col === space.col)) {
            flag = true;
        }
        if (flag == true) {
            // 通过修改id来改变图片的位置
            var temp = myclick.id;
            myclick.id = block.id;
            block.id = temp;
            var temp2 = squares[myRow][myCol];
            squares[myRow][myCol] = squares[space.row][space.col];
            squares[space.row][space.col] = temp2;
            space.row = myRow;
            space.col = myCol;
        }
        if(isSuccess() && computer == false) {
            begin = false;
            show.innerHTML = "Succeed! You have used "+count+" steps at all!";
        }
    }

    // 是否在puzzle内
    var isAvailable = function(part) {
        if (part.row <= 3 && part.col <= 3 && part.row >= 0 && part.col >= 0)
            return true;
        return false;
    }

    function onstart() {
        begin = true;
        computer = true;
        if (is_easy) {
            for (var k = 0; k < 50; k++) {
                var num = parseInt(5+Math.random()*10);
                parts[num].click();
            }
        } else {
            for (var k = 0; k < 5000; k++) {
                var num = parseInt(Math.random()*15);
                parts[num].click();
            }
        }
        // 将block恢复原位置
        for (var k = 0; ; k++) {
            var r = { row: space.row, col: space.col+1 };
            var b = { row: space.row+1, col: space.col };
            if (isAvailable(b)) {
                var num = b.row*4+b.col;
                parts[num].click();
            } else if (isAvailable(r)) {
                var num = r.row*4+r.col;
                parts[num].click();
            }
            if (space.row == 3 && space.col == 3)
                break;
        }
        succeed = false;
        count = 0;
        computer = false;
        show.innerHTML = "";
    }

    function oneasy() {
        re();
        if (is_easy == true) {
            is_easy = false;
            easy.innerHTML = "hard";
        } else {
            is_easy = true;
            easy.innerHTML = "easy";
        }
    }

    // 判断是否成功
    function isSuccess() {
        if (begin == false || computer == true) return false;
        for (var i = 0; i < 4; i++)
            for (var j = 0; j < 4; j++)
                if (squares[i][j] != originSq[i][j])
                    return false;
        succeed = true;
        return true;
    }


    function re() {
        for (var i = 0; i < 16; i++)
            parts[i].id = "p"+i;
        begin = false;
        squares = [["p0", "p1", "p2", "p3"], ["p4", "p5", "p6", "p7"], ["p8", "p9", "p10", "p11"], ["p12", "p13", "p14", "p15"]];
        space.row = space.col = 3;
        succeed = false;
        show.innerHTML = "";
    }

    function onrecover() {
        for (var i = 0; i < 16; i++)
            parts[i].id = "p"+i;
        begin = false;
        squares = [["p0", "p1", "p2", "p3"], ["p4", "p5", "p6", "p7"], ["p8", "p9", "p10", "p11"], ["p12", "p13", "p14", "p15"]];
        space.row = space.col = 3;
        succeed = false;
        show.innerHTML = ""; 
    }

    function onchange() {
        re();
        if (pic == 1) {
            var pandas = document.getElementsByClassName("part");
            for (var i = 0; i < pandas.length; i++) {
                pandas[i].className = pandas[i].className.substr(0, 5);
                pandas[i].className += "house";
            }
            img.src = "../image/house.jpg";
            pic = 2;
        } else if (pic == 2) {
            var houses = document.getElementsByClassName("part");
            for (var i = 0; i < houses.length; i++) {
                houses[i].className = houses[i].className.substr(0, 5);
                houses[i].className += "animal";
            }
            pic = 3;
            img.src = "../image/animal.jpg";
        } else if (pic == 3) {
            var animals = document.getElementsByClassName("part");
            for (var i = 0; i < animals.length; i++) {
                animals[i].className = animals[i].className.substr(0, 5);
                animals[i].className += "panda";
            }
            pic = 1;
            img.src = "../image/panda.jpg";
        }
    }
}