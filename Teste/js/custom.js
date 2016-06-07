/* slide json */
function jsonslide(){
    var srcImg = 'img/slide/';
    var qtd;
    var retorno;

    $.getJSON('js/json/slide.json', function(data){
        qtd = data.imagens.length;
        retorno = '';

        for(i = 0; i < qtd; i++ ){
            retorno +=  '<a href="#" class="trs"><img src="' + srcImg + data.imagens[i] + '" class="img-resp" /></a>';
        }
        $('#slider').html(retorno);
    });
}
jsonslide();

/* json noticias */
function jsonnoticias(){
    $.getJSON('js/json/noticias.json', function(data){
        edt = data.Editorias;
        srcImg = 'img/noticias/';
        retorno = [];
        listedit = [];

        for(var i = 0; i < edt.length; i++ ){
          var Noticias = edt[i].Noticias;
          var Editoria = edt[i].Editoria;
          var idEditoria = edt[i].Id;

          // console.log(edt[i].Editoria);

          for (var j=0;j<Noticias.length;j++) {
            // console.log("Editorial"+i,"Noticias"+j,edt[i].Noticias[j].Foto)
            retorno.push('<li class="' + Editoria + '" data-date="'+edt[i].Noticias[j].Data+'"><a href="#"><div class="image"><img src="' + srcImg + edt[i].Noticias[j].Foto + '" width="277" height="163" class="img-resp" alt="' + edt[i].Noticias[j].Titulo + '" /></div><div class="text"><h1>' + edt[i].Noticias[j].Titulo + '</h1><p>"' + edt[i].Noticias[j].Texto + '"</p></div><div class="btn"><span class="arrow"></span></div></a></li>');
          }
        }
    $('.list-notices').html(retorno.join('\n'));

    });
}
jsonnoticias();

/* home slide */
function setaImagem(){
    var settings = {
        primeiraImg: function(){
            elemento = document.querySelector("#slider a:first-child");
            elemento.classList.add("ativo");
        },

        slide: function(){
            elemento = document.querySelector(".ativo");

            if(elemento.nextElementSibling){
                elemento.nextElementSibling.classList.add("ativo");
                elemento.classList.remove("ativo");
            }else{
                elemento.classList.remove("ativo");
                settings.primeiraImg();
            }

        },

        proximo: function(){
            clearInterval(intervalo);
            elemento = document.querySelector(".ativo");

            if(elemento.nextElementSibling){
                elemento.nextElementSibling.classList.add("ativo");
                elemento.classList.remove("ativo");
            }else{
                elemento.classList.remove("ativo");
                settings.primeiraImg();
            }
            intervalo = setInterval(settings.slide,4000);
        },

        anterior: function(){
            clearInterval(intervalo);
            elemento = document.querySelector(".ativo");

            if(elemento.previousElementSibling){
                elemento.previousElementSibling.classList.add("ativo");
                elemento.classList.remove("ativo");
            }else{
                elemento.classList.remove("ativo");           
                elemento = document.querySelector("a:last-child");
                elemento.classList.add("ativo");
            }
            intervalo = setInterval(settings.slide,4000);
        }
    }

    //chama o slide
    settings.primeiraImg();

    //chama o slide à um determinado tempo
    var intervalo = setInterval(settings.slide,4000);
    document.querySelector(".next").addEventListener("click",settings.proximo,false);
    document.querySelector(".prev").addEventListener("click",settings.anterior,false);
}

/* google chart */
google.charts.load("current", {packages:["corechart"]});
google.charts.setOnLoadCallback(drawChart);
function drawChart() {
    var data = google.visualization.arrayToDataTable([
      ["Categorias", "Densidade", { role: "style" } ],
      ["POLÍTICA", 600, "#db3731"],
      ["ECONOMIA", 500, "#db3731"],
      ["CIÊNCIA", 400, "#db3731"],
      ["BRASIL", 300, "color: #db3731"],
      ["MUNDO", 200, "color: #db3731"],
      ["CULTURA", 100, "color: #db3731"]
    ]);

var view = new google.visualization.DataView(data);
view.setColumns([0, 1,
                 { calc: "stringify",
                   sourceColumn: 1,
                   type: "string",
                   role: "annotation" },
                 2]);

var options = {
  width: 600,
  height: 200,
  annotation: {
    textStyle: {color: '#000'}
  },
  hAxis: {
    gridlines: {color: '#ffffff'},
    textStyle: {color: '#ffffff'}
  },
  bar: {groupWidth: "95%"},
  legend: { position: "none" },
};
var chart = new google.visualization.BarChart(document.getElementById("barchart_values"));
chart.draw(view, options);
}

/* map */
function initMap() {
  var myLatLng = {lat: -19.212355602107472, lng: -44.20234468749999};

  var map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    scrollwheel: false,
    zoom: 10
  });

  var marker = new google.maps.Marker({
    map: map,
    icon: 'img/icon-map.png',
    position: myLatLng
  });
}
initMap();

window.addEventListener("load", setaImagem,false);

$('#select-editorial').change(function(){
    var valueedt = this.value;

    $('.list-notices li').hide();
    $('.list-notices li.' + valueedt).fadeIn().addClass('active');

});

$('#select-date').change(function(){
    var valuedate = this.value;

    if($('#select-date option:selected').text() == 'Data'){
        var container = $(".list-notices");
        var items = $(".list-notices li");
        
        items.each(function() {
           var BCDate = $(this).attr("data-date").split("-");
           var standardDate = BCDate[1]+" "+BCDate[0]+" "+BCDate[2];
           standardDate = new Date(standardDate).getTime();
           $(this).attr("data-date", standardDate);
     
        });
        
        items.sort(function(a,b){
            a = parseFloat($(a).attr("data-date"));
            b = parseFloat($(b).attr("data-date"));
            return a<b ? -1 : a>b ? 1 : 0;
        }).each(function(){
            container.prepend(this);
        });
    }

    else if($('#select-date option:selected').text() == 'A - Z'){
        var $list = $('.list-notices');
        var $listLi = $('li',$list);
        $listLi.sort(function(a, b){
            var keyA = $(a).text();
            var keyB = $(b).text();
            return (keyA > keyB) ? 1 : 0;
        });
        $.each($listLi, function(index, row){
            $list.append(row);
        });
    }
});