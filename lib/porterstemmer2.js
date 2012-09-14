// Porter stemmer in Javascript. Few comments, but it's easy to follow against the rules in the original
// paper, in
//
//  Porter, 1980, An algorithm for suffix stripping, Program, Vol. 14,
//  no. 3, pp 130-137,
//
// see also http://www.tartarus.org/~martin/PorterStemmer

// Release 1
// Derived from (http://tartarus.org/~martin/PorterStemmer/js.txt) - cjm (iizuu) Aug 24, 2009

module.exports = (function(){
  var step2list = {
      "ational" : "ate",
      "tional" : "tion",
      "enci" : "ence",
      "anci" : "ance",
      "izer" : "ize",
      "bli" : "ble",
      "alli" : "al",
      "entli" : "ent",
      "eli" : "e",
      "ousli" : "ous",
      "ization" : "ize",
      "ation" : "ate",
      "ator" : "ate",
      "alism" : "al",
      "iveness" : "ive",
      "fulness" : "ful",
      "ousness" : "ous",
      "aliti" : "al",
      "iviti" : "ive",
      "biliti" : "ble",
      "logi" : "log"
    },

    step3list = {
      "icate" : "ic",
      "ative" : "",
      "alize" : "al",
      "iciti" : "ic",
      "ical" : "ic",
      "ful" : "",
      "ness" : ""
    },

    c = "[^aeiou]",          // consonant
    v = "[aeiouy]",          // vowel
    C = c + "[^aeiouy]*",    // consonant sequence
    V = v + "[aeiou]*",      // vowel sequence

    mgr0 = "^(" + C + ")?" + V + C,               // [C]VC... is m>0
    meq1 = "^(" + C + ")?" + V + C + "(" + V + ")?$",  // [C]VC[V] is m=1
    mgr1 = "^(" + C + ")?" + V + C + V + C,       // [C]VCVC... is m>1
    s_v = "^(" + C + ")?" + v;                   // vowel in stem

  function dummyDebug() {}

  function realDebug() {
    console.log(Array.prototype.slice.call(arguments).join(' '));
  }

  return function (w, debug) {
    var
      stem,
      suffix,
      firstch,
      re,
      re2,
      re3,
      re4,
      debugFunction,
      origword = w;

    if (debug) {
      debugFunction = realDebug;
    } else {
      debugFunction = dummyDebug;
    }

    if (w.length < 3) { return w; }

    firstch = w.substr(0,1);
    if (firstch == "y") {
      w = firstch.toUpperCase() + w.substr(1);
    }

    // Step 1a
    re = /^(.+?)(ss|i)es$/;
    re2 = /^(.+?)([^s])s$/;

    if (re.test(w)) { 
      w = w.replace(re,"$1$2"); 
      debugFunction('1a',re, w);

    } else if (re2.test(w)) {
      w = w.replace(re2,"$1$2"); 
      debugFunction('1a',re2, w);
    }

    // Step 1b
    re = /^(.+?)eed$/;
    re2 = /^(.+?)(ed|ing)$/;
    if (re.test(w)) {
      var fp = re.exec(w);
      re = new RegExp(mgr0);
      if (re.test(fp[1])) {
        re = /.$/;
        w = w.replace(re,"");
        debugFunction('1b',re, w);
      }
    } else if (re2.test(w)) {
      var fp = re2.exec(w);
      stem = fp[1];
      re2 = new RegExp(s_v);
      if (re2.test(stem)) {
        w = stem;
        debugFunction('1b', re2, w);

        re2 = /(at|bl|iz)$/;
        re3 = new RegExp("([^aeiouylsz])\\1$");
        re4 = new RegExp("^" + C + v + "[^aeiouwxy]$");

        if (re2.test(w)) { 
          w = w + "e"; 
          debugFunction('1b', re2, w);

        } else if (re3.test(w)) { 
          re = /.$/; 
          w = w.replace(re,""); 
          debugFunction('1b', re3, w);

        } else if (re4.test(w)) { 
          w = w + "e"; 
          debugFunction('1b', re4, w);
        }
      }
    }

    // Step 1c
    re = new RegExp("^(.*" + v + ".*)y$");
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      w = stem + "i";
      debugFunction('1c', re, w);
    }

    // Step 2
    re = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      suffix = fp[2];
      re = new RegExp(mgr0);
      if (re.test(stem)) {
        w = stem + step2list[suffix];
        debugFunction('2', re, w);
      }
    }

    // Step 3
    re = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      suffix = fp[2];
      re = new RegExp(mgr0);
      if (re.test(stem)) {
        w = stem + step3list[suffix];
        debugFunction('3', re, w);
      }
    }

    // Step 4
    re = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
    re2 = /^(.+?)(s|t)(ion)$/;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      re = new RegExp(mgr1);
      if (re.test(stem)) {
        w = stem;
        debugFunction('4', re, w);
      }
    } else if (re2.test(w)) {
      var fp = re2.exec(w);
      stem = fp[1] + fp[2];
      re2 = new RegExp(mgr1);
      if (re2.test(stem)) {
        w = stem;
        debugFunction('4', re2, w);
      }
    }

    // Step 5
    re = /^(.+?)e$/;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      re = new RegExp(mgr1);
      re2 = new RegExp(meq1);
      re3 = new RegExp("^" + C + v + "[^aeiouwxy]$");
      if (re.test(stem) || (re2.test(stem) && !(re3.test(stem)))) {
        w = stem;
        debugFunction('5', re, re2, re3, w);
      }
    }

    re = /ll$/;
    re2 = new RegExp(mgr1);
    if (re.test(w) && re2.test(w)) {
      re = /.$/;
      w = w.replace(re,"");
      debugFunction('5', re, re2, w);
    }

    // and turn initial Y back to y
    if (firstch == "y") {
      w = firstch.toLowerCase() + w.substr(1);
    }

      // See http://snowball.tartarus.org/algorithms/english/stemmer.html
      // "Exceptional forms in general"
      var specialWords = {
        "skis" : "ski",
        "skies" : "sky",
        "dying" : "die",
        "lying" : "lie",
        "tying" : "tie",
        "idly" : "idl",
        "gently" : "gentl",
        "ugly" : "ugli",
        "early": "earli",
        "only": "onli",
        "singly": "singl"
      }, emptyObject = {};

      if(specialWords[origword] !== emptyObject[origword]){
        w = specialWords[origword];
        debugFunction('Special Word', w);
      }

      if( "sky news howe atlas cosmos bias \
         andes inning outing canning herring \
         earring proceed exceed succeed".indexOf(origword) !== -1 ){
        w = origword;
        debugFunction('Special Word', w);
      }

      // Address words overstemmed as gener-
      re = /.*generate?s?d?(ing)?$/;
      if( re.test(origword) ){
        w = w + 'at';
        debugFunction('Overstemmed', w);
      }

      re = /.*general(ly)?$/;
      if( re.test(origword) ){
        w = w + 'al';
        debugFunction('Overstemmed', w);
      }

      re = /.*generic(ally)?$/;
      if( re.test(origword) ){
        w = w + 'ic';
        debugFunction('Overstemmed', w);
      }

      re = /.*generous(ly)?$/;
      if( re.test(origword) ){
        w = w + 'ous';
        debugFunction('Overstemmed', w);
      }

      // Address words overstemmed as commun-
      re = /.*communit(ies)?y?/;
      if( re.test(origword) ){
        w = w + 'iti';
        debugFunction('Overstemmed', w);
      }

      return w;
  }
})();
