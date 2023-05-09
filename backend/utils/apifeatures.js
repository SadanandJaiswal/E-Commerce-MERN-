class ApiFeatures {
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search(){
        // console.log('keyword -> ',this.queryStr.keyword)
        const keyword = this.queryStr.keyword ?{
            name:{
                $regex:this.queryStr.keyword,
                $options:'i',
            },

        }:"";

        // console.log('keyword '+keyword);
        this.query= this.query.find({...keyword});
        return this;
    }

    // filter search
    filter(){
        const queryCopy = {...this.queryStr}
        // remove some filed for category
        console.log('qstr')
        console.log(this.queryStr)
        console.log('before remove ');
        console.log(queryCopy)
        const removefields = ['keyword','page','limit'];

        removefields.forEach(key=>delete queryCopy[key]);
        // console.log('after remove ' + queryCopy );

        // filter for price and rating
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt\lte)\b/g,key => `$${key}`)

        console.log('after remove')
        console.log(queryStr);

        // this.query = this.query.find(queryCopy);
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    pageination(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1;    // convert to number

        const skip = resultPerPage*(currentPage -1);    // kitne product skip karni hai
        // jaise ki pehle page pe 0, second page pe pehle 10 skip honge 

        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
};


module.exports = ApiFeatures;