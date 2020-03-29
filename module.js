var math={}
math.util={}
math.util.abs=Math.abs
math.util.acos=function(a){return math.trigonometry._rd(Math.acos(a))}
math.util.asin=function(a){return math.trigonometry._rd(Math.asin(a))}
math.util.atan=function(a){return math.trigonometry._rd(Math.atan(a))}
math.util.atan2=function(a){return math.trigonometry._rd(Math.atan2(a))}
math.util.ceil=Math.ceil
math.util.cos=function(a){return math.trigonometry._rd(Math.cos(a))}
math.util.exp=Math.exp
math.util.float=parseFloat
math.util.floor=Math.floor
math.util.gcd=function(a,b){
	while (true){
		if (b==0){
			return a
		}
		var tmp=a
		a=b
		b=tmp%b
	}
}
math.util.int=parseInt
math.util.lcm=function(a,b){return a*b/math.util.gcd(a,b)}
math.util.log=Math.log
math.util.map=function(v,as,ae,bs,be){return (v-as)/(ae-as)*(be-bs)+bs}
math.util.max=Math.max
math.util.min=Math.min
math.util.pow=Math.pow
math.util.round=Math.round
math.util.sin=function(a){return math.trigonometry._rd(Math.sin(a))}
math.util.sqrt=Math.sqrt
math.util.tan=function(a){return math.trigonometry._rd(Math.tan(a))}
math.constants={}
math.constants.DEGREES=0
math.constants.DEG_TO_RAD=Math.PI/180
math.constants.HALF_PI=Math.PI/2
math.constants.PI=Math.PI
math.constants.QUARTER_PI=Math.PI/2
math.constants.RADIANS=1
math.constants.RAD_TO_DEG=180/Math.PI
math.constants.TWO_PI=Math.PI*2
math.vector={}
math.vector._v=class _Vec{
	constructor(...v){
		this.set(...v)
		return this
	}
	add(...v){
		this._o(v,(a,b)=>a+b)
		return this
	}
	angleBetween(a){
		return math.util.acos(math.util.min(math.util.max(this.dot(a)/(this.mag()*a.mag(),-1),1)))
	}
	clone(){
		return new math[this.constructor.name](...this.toArray())
	}
	cross(...a){
		a=this._l(a)
		if (this.get_length==3&&a.get_length==3){
			var da=this.getDict(),db=a.getDict()
			return new Vector3(da.y*db.z-da.z*db.y,da.z*db.x-da.x*db.z,da.x*db.y-da.y*db.x)
		}
		return 0
	}
	dist(...a){
		a=this._l(a)
		return a.clone().sub(this).mag()
	}
	div(...v){
		this._o(v,(a,b)=>a/b)
		return this
	}
	dot(...a){
		a=new math[this.constructor.name](...this._l(a))
		var b="xyzw".split(""),s=0
		for (var i=0;i<this.get_length();i++){
			var n=b.shift()
			s+=this.toDict()[n]*a.toDict()[n]
		}
		return s
	}
	equals(...a){
		var v=new math[this.constructor.name](...this._l(a))
		var b="xyzw".split(""),s=0
		for (var i=0;i<this.get_length();i++){
			var n=b.shift()
			if (v.toDict()[n]!=this.toDict()[n]){return false}
		}
		return ((Array.isArray(a)&&a.length==this.get_length())||(a.length==1&&a[0].constructor.name.substring(0,6)=="Vector"&&a[0].get_length()==this.get_length()))
	}
	fromAngle(a,b,c,d,e){
		if (this.get_length()==2){
			a=a||0
			b=b||1
			c=c||b
			this.set(b*math.util.cos(a),c*math.util.sin(a))
		}
		else if (this.get_length()==3){
			a=a||0
			b=b||0
			c=c||1
			d=d||c
			e=e||c
			this.set(c*math.util.sin(a)*math.util.sin(b),-d*math.util.cos(a),e*math.util.sin(a)*math.util.cos(b))
		}
		return this
	}
	get_length(){
		return parseInt(this.constructor.name.substring(6))
	}
	heading(){
		return math.trigonometry.format(math.util.atan2(...this.toArray().reverse()),math.constants.RADIANS)
	}
	lerp(...a){
		var c=a.splice(a.length-1,1)||0
		a=new math[this.constructor.name](...this._l(a))
		var b="xyzw".split(""),v=[]
		for (var i=0;i<this.get_length();i++){
			var n=b.shift()
			v.push((a.toDict()[n]-this.toDict()[n])*c)
		}
		this.add(...v)
		return this

	}
	limit(a){
		if (this.magSq()>a*a){this.div(this.magSq()).mult(a)}
		return this
	}
	log(){
		var s=`Vector -> ${this.get_length()}\n`
		for (var i=0;i<`Vector -> ${this.get_length()}`.length;i++){s+="-"}
		for (var k of Object.keys(this.toDict())){
			s+=`\n  ${k} = ${this.toDict()[k]}`
		}
		return s
	}
	mag(){
		return math.util.sqrt(this.magSq())
	}
	magSq(){
		var a=0
		this.toArray().forEach((n)=>a+=n*n)
		return a
	}
	mult(...v){
		this._o(v,(a,b)=>a*b)
		return this
	}
	normalize(){
		if (this.mag()!=0){this.div(this.mag())}
		return this
	}
	random1D(){
		this.set(math.random.random()*2-1)
		return this
	}
	random2D(){
		this.fromAngle(math.random.random()*math.constants.TWO_PI)
		return this
	}
	random3D(){
		var a=math.random.random()*math.constants.TWO_PI
		var z=math.random.random()*2-1,zBase=math.util.sqrt(1-z*z),x=zBase*math.util.cos(a),y=zBase*math.util.sin(a)
		this.set(x,y,z)
		return this
	}
	rotate(a){
		this.set(math.util.cos(this.heading()+a)*this.mag(),math.util.sin(this.heading()+a)*this.mag())
	}
	set(...v){
		this._o(v,(a,b)=>b)
		return this
	}
	setMag(a){
		this.normalize().mult(a)
		return this
	}
	sub(...v){
		this._o(v,(a,b)=>a-b)
		return this
	}
	toArray(){
		var a="xyzw".split(""),b=[]
		for (var i=0;i<this.get_length();i++){
			b.push(this[a.shift()])
		}
		return b
	}
	toDict(){
		var a="xyzw".split(""),b={}
		for (var k of this.toArray()){
			b[a.shift()]=k
		}
		return b
	}
	_l(v){
		if (v.length==1&&v[0].constructor.name.substring(0,6)=="Vector"){v=v[0].toArray()}
		var a=[]
		for (var k of v){
			a.push(k||0)
			if (a.length==this.get_length()){return a}
		}
		while (true){
			if (a.length==this.get_length()){break}
			a.push(0)
		}
		return a
	}
	_o(v,f){
		v=this._l(v)
		var a="xyzw".split("")
		for (var k of v){
			var n=a.shift()
			this[n]=f(this[n]||0,k)
		}
	}
}
math.vector.Vector1=class Vector1 extends math.vector._v{
	constructor(x){
		super(x)
	}
}
math.vector.Vector2=class Vector2 extends math.vector._v{
	constructor(x,y){
		super(x,y)
	}
}
math.vector.Vector3=class Vector3 extends math.vector._v{
	constructor(x,y,z){
		super(x,y,z)
	}
}
math.vector.Vector4=class Vector4 extends math.vector._v{
	constructor(x,y,z,w){
		super(x,y,z,w)
	}
}
math.vector.create_vector=function(...a){
	switch (a.length){
		case 1:return new math.vector.Vector1(...a);break
		case 2:return new math.vector.Vector2(...a);break
		case 3:return new math.vector.Vector3(...a);break
		case 4:return new math.vector.Vector4(...a);break
	}
	return null
}
math.matrix={}
math.matrix._m=class _Mtr{
	constructor(p){
		p.data=p.data!=undefined?this._l(p.data||[],true):null
		this.width=p.width||p.data[0].length
		this.height=p.height||p.data.length
		this.data=[]
		this._c().fill(p.data||null)
		return this
	}
	add(dt){
		this._o(dt,(a,b)=>a+b)
		return this
	}
	clone(){
		return new math.matrix.Matrix({data:this.getAll()})
	}
	div(dt){
		this._o(dt,(a,b)=>a/b)
		return this
	}
	fill(dt){
		if (dt==null){return this}
		if (!dt.constructor.name==Number){
			dt=this._l(dt)
		}
		for (var j=0;j<this.height;j++){
			for (var i=0;i<this.width;i++){
				this.data[j][i]=dt[j]?dt[j][i]:dt
			}
		}
		return this
	}
	get(i,j){
		return this.data[j][i]
	}
	getAll(){
		return this.data
	}
	log(){
		var s=`Matrix -> ${this.width} x ${this.height}\n`
		for (var i=0;i<`Matrix -> ${this.width} x ${this.height}`.length;i++){s+="-"}
		var cw=[],mn=[]
		for (var j=0;j<this.height;j++){
			for (var i=0;i<this.width;i++){
				cw[i]=cw[i]||0
				cw[i]=math.util.max(cw[i],this.data[j][i].toString().replace("-","").length)
				mn[i]=mn[i]||false
				mn[i]=this.data[j][i].toString()[0]=="-"||mn[i]
			}
		}
		for (var j=0;j<this.height;j++){
			var str=""
			for (var i=0;i<this.width;i++){
				str+=" "
				if (mn[i]==true&&this.data[j][i].toString()[0]!="-"){str+=" "}
				str+=this.data[j][i].toString()
				for (var k=cw[i]-this.data[j][i].toString().replace("-","").length;k>=0;k--){
					str+=" "
				}
			}
			s+=`\n${str.substring(1)}`
		}
		return s+"\n"
	}
	map(f){
		for (var j=0;j<this.height;j++){
			for (var i=0;i<this.width;i++){
				this.data[j][i]=f(this.data[j][i],i,j,this.getAll())
			}
		}
		return this
	}
	mult(dt){
		this._o(dt,(a,b)=>a*b)
		return this
	}
	multEl(dt){
		return this._o(dt,null,true)
	}
	set(i,j,v){
		this.data[j][i]=v
		return this
	}
	sub(dt){
		this._o(dt,(a,b)=>a-b)
		return this
	}
	transpose(){
		var nm=new math.matrix.Matrix({width:this.height,height:this.width})
		for (var j=0;j<this.height;j++){
			for (var i=0;i<this.width;i++){
				nm.set(j,i,this.get(i,j))
			}
		}
		return nm
	}
	_c(){
		for (var j=0;j<this.height;j++){
			this.data.push([])
			for (var i=0;i<this.width;i++){
				this.data[j].push(0)
			}
		}
		return this
	}
	_l(dt,f){
		if (dt.constructor.name.substring(0,6)=="Vector"){
			dt=dt.toArray()
		}
		if (dt.constructor.name.substring(0,6)=="Matrix"){
			dt=dt.getAll()
		}
		if (Array.isArray(dt)&&!Array.isArray(dt[0])){
			var ta=[]
			for (var k of dt){
				ta.push([k])
			}
			dt=ta.slice()
		}
		if (f==true){return dt}
		for (var j=0;j<this.height;j++){
			dt[j]=dt[j]||[]
			for (var i=0;i<this.width;i++){
				dt[j][i]=dt[j][i]||0
			}
		}
		return dt
	}
	_o(dt,f,p){
		dt=this._l(dt)
		if (p!=true){
			if (dt[0].length!=this.data[0].length){console.warn("Columns A doesn't match columns B");return this}
			if (dt.length!=this.data.length){console.warn("Rows A doesn't match rows B");return this}
			for (var j=0;j<this.height;j++){
				this.data.push([])
				for (var i=0;i<this.width;i++){
					this.data[j][i]=f(this.data[j][i],dt[j][i])
				}
			}
			return this
		}
		if (dt[0].length!=this.data.length){console.warn("Rows A doesn't match columns B");return this}
		var na=[]
		for (var i=0;i<this.data.length;i++){
			na[i]=[]
			for (var j=0;j<dt[0].length;j++){
				na[i][j]=0
				for (var k=0;k<this.data[0].length;k++){
					na[i][j]+=this.data[i][k]*dt[k][j]
				}
			}
		}
		return new math.matrix.Matrix({data:na})
	}
}
math.matrix.Matrix=class Matrix extends math.matrix._m{
	constructor(p){
		super(p)
	}
}
math.trigonometry={}
math.trigonometry._m=0
math.trigonometry.angleMode=function(a){
	math.trigonometry._m=a
}
math.trigonometry.toRadians=function(a){
	return a*math.constants.DEG_TO_RAD
}
math.trigonometry.toDegrees=function(a){
	return a*math.constants.RAD_TO_DEG
}
math.trigonometry.format=function(a,b){
	if (math.trigonometry._m==0){
		return math.trigonometry._m==b?a:math.trigonometry.toDegrees(a)
	}
	return math.trigonometry._m==b?a:math.trigonometry.toRadians(a)
}
math.trigonometry._rd=function(a){
	return math.util.floor(a*10**10)/10**10
}
math.random={}
math.random.random=function(min,max){
	min=min||0
	max=max||1
	return Math.random()*(max-min)+min
}
math.random.randInt=function(min,max){
	min=min||0
	max=max||Number.MAX_SAFE_INTEGER
	return math.random.random(0,1)*(max-min)+min
}
math.random.randomEl=function(a){
	return a[math.random.randInt(0,a.length-1)]
}
math.fraction={}
math.fraction._Frc=class _Frc{
	constructor(a,b,c){
		this.whole=0
		this.nom=0
		this.denom=1
		this.neg=false
		this.set(a,b,c)
	}
	add(a,b,c){
		if (a.constructor.name=="Fraction"){[a,b,c]=a.toArray()}
		a=create_fraction(a,b,c)
		var v=math.util.lcm(this.denom,a.denom)
		this.set(0,(this.whole*this.denom+this.nom)*(v/this.denom)*(this.neg==true?-1:1)+(math.util.abs(a.whole)*a.denom+a.nom)*(v/a.denom)*(a.neg==true?-1:1),v)
		this._fr()
		return this
	}
	sub(a,b,c){
		if (a.constructor.name=="Fraction"){[a,b,c]=a.toArray()}
		a=create_fraction(a,b,c)
		var v=math.util.lcm(this.denom,a.denom)
		this.set(0,(this.whole*this.denom+this.nom)*(v/this.denom)*(this.neg==true?-1:1)-(math.util.abs(a.whole)*a.denom+a.nom)*(v/a.denom)*(a.neg==true?-1:1),v)
		return this
	}
	mult(a,b,c){
		if (a.constructor.name=="Fraction"){[a,b,c]=a.toArray()}
		a=create_fraction(a,b,c)
		this.set(0,((this.whole*this.denom+this.nom)*(this.neg==true?-1:1))*((a.whole*a.denom+a.nom)*(a.neg==true?-1:1)),this.denom*a.denom)
		return this
	}
	div(a,b,c){
		if (a.constructor.name=="Fraction"){[a,b,c]=a.toArray()}
		a=create_fraction(a,b,c)
		a.invert()
		this.mult(a)
		return this
	}
	invert(){
		var v=(this.whole*this.denom+this.nom)*(this.neg==true?-1:1)
		this.nom=this.denom
		this.denom=v
		this._fr()
		return this
	}
	set(a,b,c){
		if (typeof a=="string"&&b==undefined&&c==undefined){
			a=a.split(" ")
			if (a.length==2){
				b=a[1].split("/")[0]
				c=a[1].split("/")[1]
				a=a[0]
			}
			else if (a.length==1){
				if (a[0].split("/").length==1){
					a=a[0]
					b=0
					c=1
				}
				else{
					b=a[0].split("/")[0]
					c=a[0].split("/")[1]
					a=0
				}
			}
			else{
				a=0
				b=0
				c=1
			}
		}
		this.whole=math.util.int(a)
		this.nom=math.util.int(b)
		this.denom=math.util.int(c)
		this._fr()
		return this
	}
	toArray(){
		return [this.whole*(this.neg==true?-1:1),this.nom,this.denom]
	}
	getNumber(){
		return (this.whole+this.nom/this.denom)*(this.neg==true?-1:1)
	}
	getSimple(){
		return `${this.neg==true?"-(":""}${this.whole!=0?this.whole:""}${this.whole!=0&&this.nom!=0?" + ":""}${this.nom!=0?this.nom+" / "+this.denom:""}${this.neg==true?")":""}`
	}
	getImproper(){
		return `${this.neg==true?"-":""}${this.whole*this.denom+this.nom} / ${this.denom}`
	}
	log(){
		return `Fraction\n--------\nSimple => \t${this.getSimple()}\nImproper => ${this.getImproper()}\nNumber => \t${this.getNumber()}`
	}
	_fr(){
		if (this.nom<0){
			this.nom=math.util.abs(this.nom)
			this.neg=true
		}
		if (this.whole<0){
			this.whole=math.util.abs(this.whole)
			this.neg=true
		}
		if (this.nom>this.denom){
			this.whole+=math.util.floor(this.nom/this.denom)
			this.nom%=this.denom
		}
		var v=math.util.gcd(this.nom,this.denom)
		this.nom/=v
		this.denom/=v
		if (this.nom==this.denom){
			this.whole++
			this.nom=0
			this.denom=1
		}
	}
}
math.fraction.Fraction=class Fraction extends math.fraction._Frc{
	constructor(a,b,c){
		super(a,b,c)
	}
}
math.fraction.create_fraction=function(a,b,c){
	return new math.fraction.Fraction(a,b,c)
}
math.import=function(w){
	function _get(o){
		var a=[]
		for (var ki of Object.keys(o)){
			var k=o[ki]
			if ((k.toString().substring(0,8)=="function"||k.toString().substring(0,5)=="class"||k.toString().replace(/_/g,"")==k.toString().replace(/_/g,"").toUpperCase())&&ki[0]!="_"){
				a.push({n:ki,v:k})
			}
			else if (k.constructor==Object){
				a=a.concat(_get(k))
			}
		}
		return a
	}
	w=w||window
	for (var k of _get(math)){
		w[k.n]=k.v
	}
}