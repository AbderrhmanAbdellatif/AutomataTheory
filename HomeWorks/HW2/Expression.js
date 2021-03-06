var tok    
var tokens 
let space = ' '
var count = -1;
function match(k) {
    if (tok.kind == k) 
        tok = tokens.pop();
    else expected(k);
}
function expected(s) {
    error(s+" expected -- "+tok+" found");
}
function error(s) {
    throw ("At index "+tok.index+": "+s);
}
function showError(elt) {
    
        elt.selectionStart = tok.index;
        elt.selectionEnd = tok.index + tok.length;
        elt.focus();     

    
}

class mathfunctionConstant {
    constructor(f, num) {
        this.f = f;
        this.num = num;}
    fValue() { 	return Math[this.f](this.num);	}
    toTree(val) { return space.repeat(val) + this.f + " " + this.num+'\n'; }
    toPostfix() { return this.f + " " + this.num+' '; }
    toString() { return this.f + "(" + this.num.toString() + ")"; }
}

class Constant {
   constructor(num) { this.num = num; }
   fValue() { return this.num; }
   toTree(val) { return space.repeat(val) + this.num+'\n'; }
   toPostfix() { return this.num+' '; }
   toString() { return this.num.toString(); }
}

class Binary {
   constructor(left, oper, right) {
      this.left = left; this.oper = oper; this.right = right;
   }
   fValue() {
      switch (this.oper) {
      case PLUS:  return this.left.fValue()+this.right.fValue();
      case MINUS: return this.left.fValue()-this.right.fValue();
      case STAR:  return this.left.fValue()*this.right.fValue();
      case MOD:   return this.left.fValue()%this.right.fValue();
      case SLASH: 
         let v = this.right.fValue();
         if (v == 0) 
            throw ("Division by zero");
         return this.left.fValue()/v;
      default: return NaN;
      }
   }
   toTree() {
   
      return  space.repeat(++count)+this.oper+'\n'+this.left.toTree(count)+this.right.toTree(count--)
   }
   toPostfix() {
      return this.left.toPostfix()+this.right.toPostfix()+this.oper+' '
   }
   toString() {
      return '('+this.left + this.oper + this.right+')'
   }
}

function binary(e) {
    let op = tok.kind; match(op);
    return new Binary(e, op, term());
}
function expression() {
    let e = (tok.kind == MINUS)?
      binary(new Constant(0)) : term();
    while (tok.kind == PLUS || tok.kind == MINUS) 
      e = binary(e);
    return e;
}
function term() {
    let e = factor();
    while (tok.kind == STAR || tok.kind == SLASH || tok.kind == POWER|| tok.kind== MOD) {
        let op = tok.kind; match(op);
        e = new Binary(e, op, factor());
    }
    return e;
}

function mathfunction(oper, right) { // burada cos function hem de  icindeki rakam
    let F = Object.getOwnPropertyNames(Math) //tum math funkyonlar gosteriyo
    let a = F.filter(k => Math[k].length == 1 && k == oper)// gelen cos ya de sin math object equal midir diye bakiyor
    if (a.length == 1)
        return [Math[a[0]](this.rigth), right];//cos(45) sonucu geri douyor 
    return -1;    
}
function factor() {
    let b = tok.value;
    switch (tok.kind)  {
    case NUMBER:
      let c = tok.val;
      match(NUMBER);
      return new Constant(c);
    case LEFT:
      match(LEFT); 
      let e = expression();
      match(RIGHT); return e;
    case IDENT:
        let s = tok.val;// gelen tok aliyor yani ident sin gibi ya de cos gibi 
        match(IDENT);// ilk olarak sin gibi ya de cos gibi fonksyonlar aliyor
        match(LEFT);// "(" ona bakiyor 
        let Value = mathfunction(s, expression()); // hocanin verdigi kodu math funkyonlar icin tek paramtrik bir icin numberler aliyor
        console.log(Value[1]);
        match(RIGHT);// ")" ona bakiyor  
		//console.log(value[1]+"kskgb");
        return new mathfunctionConstant(s, Value[1]);// fonskyon sin ya de cos geri donuyor ve icindeki number 

    default: expected("Factor");
    }
    

    return null;
}

