
/**
 * @name exams tmr
 * @artist potasmic
 */
//global 
var b = 1.85;
var s = 1/12;

//modules
import envelope from 'opendsp/envelope';
import Delay from 'opendsp/delay';

var del = Delay(2056*10);


var kick_seq =  [1,0,0,0.3,1,0,0.3,0,1,0,0,0.3,1,0,0.3,0];
var snare_seq=  [0,0,0,0.0,1,0,0.0,0,0,0,0,0.0,1,0,0.0,0];
var synth_seq=  [0.07,0.5,0.5,0.5];
var synth_not=  [440,880,660,1010];

export function dsp(t) {
  var g2 = glitchr(t,1,b*4,0)
  var gl = glitchr(t,s*5,b/32,1+g2);
  
  var kick_out = seq(t,1/16,b,kick_seq) * kick(t,3.5,190,b/16);
  var snare_out= seq(t,1/16,b,snare_seq)* noise() * envelope(t,b/16,8,100);
  var note     = seq(t,1,b,synth_not);
  var synth    = seq(t,1/16,b,synth_seq)* sqr(t, 0.25*note*gl, 0.7);
  
  var out = kick_out
  + snare_out
  + synth * 0.0
  + (envelope(t,b/16,10,8)-1) 
  * del.feedback(0.2).delay(2048*4).run(synth)
  ;
  
  return out;
}


function kick(t,base,dec, intv) {
  return Math.sin(2* Math.PI * (base * Math.exp(dec * (-t%intv))));
}

export function glitchr(t, amount, frequency, base, offset) {
  var ff = offset? offset: 0;
  return ((t+ff)%frequency < frequency/2)? amount : base;
}

function sqr(t,f,p) {
  return p > (Math.sin(2*Math.PI * t * f));
}

function noise() {
  return Math.random()-Math.random();
}

function seq(t,sc,ms,ar) {
  var ind = Math.floor((t/sc)/ms) % ar.length;
  return ar[ind];
}