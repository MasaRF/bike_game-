var c = document.createElement('canvas');
// htmlに新たな要素を作る
var ctx = c.getContext('2d');


// 塗りつぶしの色
ctx.fillStyle = "red" ;
ctx.arc( 100, 100, 50, 0 * Math.PI / 180, 360 * Math.PI / 180, false ) ;
// 塗りつぶしを実行
ctx.fill() ;

c.width = 700;
c.height = 500;

document.body.appendChild(c);
// htmlに追加

var perm = [];

while (perm.length < 255){
    while (perm.includes(val = Math.floor(Math.random() *255)));
    perm.push(val);
}

var lerp = (a, b, t) => a + (b - a)* (1 - Math.cos(t * Math.PI)) / 2;
// 線形分離のtを変えることで地形を変えられる

var noise = x => {
    x = x * 0.01 % 225;
    return lerp(perm[Math.floor(x)], perm[Math.ceil(x)], x - Math.floor(x));
}
// 線形分離(lerp)二点をつなげる

var player = new function(){
    this.x = c.width / 2;
    this.y = 0;
    this.ySpeed = 0;
    this.rot = 0;
    this.rSpeed = 0;

    this.img = new Image();
    this.img.src = '/Users/murabayashimasanori/Desktop/Programing/project1_game_bike/bikerider01.png';


    this.draw = function(){
        var p1 = c.height - noise(t + this.x) * 0.25;
        var p2 = c.height - noise(t + 5 + this.x) * 0.25;
        // p1は凸凹の高さを微調整、
        var grounded = 0

        if(p1 - 15> this.y ){
            this.ySpeed += 0.1;
        //  yが正の方向に上がっていく
        } else {
            this.ySpeed -= this.y - (p1 - 15);
            // 境界線p1からyが増えるにつれてySpeedは負の方向へ強 まる
            this.y = p1 - 15;
            grounded = 1;
        }
        // p1は山の斜面の境界を示している

        if(!playing || grounded && Math.abs(this.rot) > Math.PI * 0.5){
            // 1/2πより大きくなった場合↓
            playing = false;
            this.rSpeed = 5;
            k.ArrowUp = 1;
            this.x -= speed * 5;

        }

        var angle = Math.atan2((p2 - 15) - this.y, (this.x + 5) -this.x);


        this.y += this.ySpeed;

        if(grounded && playing){
            this.rot -= (this.rot - angle) * 0.5;
            this.rSpeed = this.rSpeed - (angle - this.rot);
        }

        this.rSpeed += (k.ArrowLeft - k.ArrowRight) * 0.05;
        // バイクの前後の回転を調整可能にする
        this.rot -= this.rSpeed * 0.1;

        if(this.rot > Math.PI) this.rot = -Math.PI;
        if(this.rot < -Math.PI) this.rot = Math.PI;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        // saveとrestoreで画面は固定されている
        ctx.drawImage(this.img, -15, -15, );
        // 大きさを調整するときは100,横に記述
        ctx.restore();
    }
}

var t = 0;
var speed = 0;
var playing = true;
var k = {ArrowUp: 0, ArrowDown: 0, ArrowLeft: 0, ArrowRight: 0};

function loop(){
    speed -= (speed - (k.ArrowUp - k.ArrowDown))* 0.1;
    // k.ArrowUpで加速,k.ArrowDownで減速、一度speedで引くことでspeedを遅くする
    t += 5 * speed;
    // 5という速度にspeedで変化をもたらせる
    // １ずつ増加、noiseに入れることでループするたびに変化する
    ctx.fillStyle = '#19f';
    ctx.fillRect(0, 0, c.width, c.height);

    ctx.fillStyle = 'black';

    ctx.beginPath();
    ctx.moveTo(0, c.height)

    for (var i = 0; i < c.width; i++){
        ctx.lineTo(i, c.height - noise(t + i) * 0.25);
    }

    ctx.lineTo(c.width, c.height);

    ctx.fill();

    player.draw();
    requestAnimationFrame(loop);
    // 何度も続けさせたい関数を入れる
}

onkeydown = d => k[d.key] = 1;
onkeyup = d => k[d.key] = 0;

loop();
