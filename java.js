var options = ["BÔNUS DE ATÉ R$1000", "SEM SORTE GIRAR NOVAMENTE", "BÔNUS DE ATÉ R$2000", "SEM SORTE GIRAR NOVAMENTE", "BÔNUS DE ATÉ R$3000", "SEM SORTE GIRAR NOVAMENTE", "BÔNUS DE ATÉ R$800", "SEM SORTE GIRAR NOVAMENTE"];
var colors = ['#c60001', '#f4c676', "#c60001", '#f4c676', '#c60001', '#f4c676', '#c60001', '#f4c676'];
var colors_font = ['#fff', '#000', "#fff", '#000', '#fff', '#000', '#fff', '#000']

var startAngle = 0;
var arc = Math.PI / (options.length / 2);
var spinTimeout = null;

var spinArcStart = 10;
var spinTime = 0;
var spinTimeTotal = 0;


function drawRouletteWheel() {
  var canvas = document.getElementById("roleta");

  if (canvas.getContext) {
    var outsideRadius = 250;
    var textRadius = 220;
    var insideRadius = 0;

    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 500, 500);

    ctx.strokeStyle = 'rgba(0,0,0,0.0)';
    ctx.fillStyle = 'rgba(0,0,0,0.0)';
    ctx.lineWidth = 0;

    ctx.font = 'bold 14pt Arial';

    for (var i = 0; i < options.length; i++) {
      var angle = startAngle + i * arc;
      //ctx.fillStyle = colors[i];
      ctx.fillStyle = colors[i]; //getColor(i, options.length);

      ctx.beginPath();
      ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
      ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
      ctx.stroke();
      ctx.fill();

      ctx.save();
      ctx.shadowOffsetX = -1;
      ctx.shadowOffsetY = -1;
      ctx.shadowBlur = 0;
      ctx.fillStyle = colors_font[i];
      ctx.translate(
        250 + Math.cos(angle + arc / 2) * textRadius,
        250 + Math.sin(angle + arc / 2) * textRadius
      );
      ctx.rotate(angle + arc / 2 + Math.PI / 2);
      var text = options[i];
      ctx.textAlign = "center";

      // Quebra as palavras em colunas
      var words = text.split(" ");
      var line = "";
      var lineHeight = 25;
      var y = 0;
      for (var j = 0; j < words.length; j++) {
        var testLine = line + words[j] + " ";
        var metrics = ctx.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > 50 && j > 0) { // 100 é o limite de largura da coluna
          ctx.fillText(line, 0, y);
          line = words[j] + " ";
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 0, y);

      ctx.restore();
    }

    // Desenhar a seta amarela apontando para baixo no topo do objeto canvas
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.moveTo(250, 20);
    ctx.lineTo(245, 0);
    ctx.lineTo(255, 0);
    ctx.closePath();
    ctx.fill();





    // // Define o centro do círculo
    // var centerX = canvas.width / 2;
    // var centerY = canvas.height / 2;

    // // Define o raio do círculo
    // var radius = 80;

    // // Define o gradiente
    // var gradient = ctx.createLinearGradient(centerX - radius, centerY - radius, centerX + radius, centerY + radius);
    // gradient.addColorStop(0.3, "yellow");
    // gradient.addColorStop(1, "goldenrod");
    // gradient.addColorStop(0.3, "yellow");



    // // Define o preenchimento do círculo como o gradiente
    // ctx.fillStyle = gradient;

    // // Desenha o círculo
    // ctx.beginPath();
    // ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    // ctx.fill();
    // ctx.closePath();

    // // Define o estilo do texto
    // ctx.font = "bold 20pt Arial";
    // ctx.fillStyle = "black";
    // ctx.textAlign = "center";
    // ctx.textBaseline = "middle";

    // // Define o texto
    // var text = "GIRAR";

    // // Desenha o texto dentro do círculo
    // ctx.fillText(text, centerX, centerY);



  }

}
function spin() {

  spinAngleStart = 11.96;// Math.random() * 10 + 10;
  spinTime = 0;
  spinTimeTotal = 4000;//Math.random() * 3 + 4 * 1000;

  // console.log('sping_angle: ' + spinAngleStart);
  // console.log('spin_total: ' + spinTimeTotal);

  rotateWheel();
}

function rotateWheel() {
  spinTime += 30;
  if (spinTime >= spinTimeTotal) {
    stopRotateWheel();
    return;
  }
  var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI / 180);
  drawRouletteWheel();
  spinTimeout = setTimeout('rotateWheel()', 30);
}



function stopRotateWheel() {
  clearTimeout(spinTimeout);
  var degrees = startAngle * 180 / Math.PI + 90;
  var arcd = arc * 180 / Math.PI;
  var index = Math.floor((360 - degrees % 360) / arcd);
  ctx.save();
  ctx.font = 'bold 30px Helvetica, Arial';
  var text = options[index]


  

  if(text != options[1])
  {
    document.getElementById('text-ganho').innerHTML = text + " para novos jogadores é seu!";
    let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('sucesso-modal')) // Returns a Bootstrap modal instance
    ativarBotao();
    // Show or hide:
    modal.show();
  }
  else
  {
    document.getElementById('text-modal').innerHTML = "INFELIZMENTE, VOCÊ NÃO TEVE SORTE EM SUA PRIMEIRA RODADA.";
    let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modal-novamente')) // Returns a Bootstrap modal instance
    ativarBotao();
    // Show or hide:
    modal.show();
  }

  //   alert(text);
  //   ctx.fillText(text, 250 - ctx.measureText(text).width / 2, 250 + 10);
  ctx.restore();
}

function easeOut(t, b, c, d) {
  var ts = (t /= d) * t;
  var tc = ts * t;
  return b + c * (tc + -3 * ts + 3 * t);
}

function ativarBotao() {
  document.getElementById("spin").disabled = false;
}

function desabilitarBotao() {

  spin();
  setTimeout(ativarBotao(), 3000);
  document.getElementById("spin").disabled = true;
}
drawRouletteWheel();

