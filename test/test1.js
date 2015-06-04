console.log('starting test');
var chai = require('chai');
var chaiHttp = require('chai-http');
var async = require('async');

var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

var http = require('http');
chai.use(chaiHttp);

describe('Recipe list result', function() { // to change
    this.timeout(15000);
    
    var requestResult;
    var response;
    
    before(function(done) {
        chai.request('http://localhost:8010')
            .get('/app/recipeList/') // to change
            .end(function (err, res) {
                requestResult = res.body;
                response = res;
                done();
            });
    });
    console.log('did .get the thing');
    
    it('Should return recipe list (array)', function(done) {
        expect(response).to.have.status(200);
        expect(requestResult).to.be.an.object;
        expect(requestResult).to.have.length.above(1);
        expect(response).to.have.headers;
        done();
    });
    console.log('did the expect on the response and requestResult');
    
    it('The first entry in the array has known properties', function(done) {
        expect(requestResult[0]).to.include.keys('name');
        expect(response.body).to.not.be.a.string;
        done();
    });
    
    it('The elements in the array have the expected properties', function(done) {
        expect(response.body).to.satisfy(
            function (body) {
                for (var i = 0; i < body.length; i++) {
                    expect(body[i]).to.have.property('_id').that.is.a('string');
                    expect(body[i]).to.have.property('chefID').that.is.a('string');
                    expect(body[i]).to.have.property('chefName').that.is.a('string');
                    expect(body[i]).to.have.property('comments').that.is.a('array');
                    expect(body[i]).to.have.property('cooktime').that.is.a('string');
                    expect(body[i]).to.have.property('description').that.is.a('string');
                    expect(body[i]).to.have.property('image').that.is.a('string');
                    expect(body[i]).to.have.property('ingredients').that.has.length.above(0);
                    expect(body[i]).to.have.property('instructions').that.has.length.above(0);
                    expect(body[i]).to.have.property('name').that.is.a('string');
                    expect(body[i]).to.have.property('prep').that.is.a('string');
                    expect(body[i]).to.have.property('recipeId').that.is.a('string');
                    expect(body[i]).to.have.property('servings').that.is.a('string');
                    expect(body[i]).to.have.property('sharedWith').that.is.a('array');
                }
                return true;
            });
        done();
    });
});

describe('Chef list result', function() { // to change
    this.timeout(15000);
    
    var requestResult;
    var response;
    
    before(function(done) {
        chai.request('http://localhost:8010')
            .get('/app/chefList/') // to change
            .end(function (err, res) {
                requestResult = res.body;
                response = res;
                done();
            });
    });
    console.log('did .get the thing');
    
    it('Should return chef list (array)', function(done) {
        expect(response).to.have.status(200);
        expect(requestResult).to.be.an.object;
        expect(requestResult).to.have.length.above(1);
        expect(response).to.have.headers;
        done();
    });
    console.log('did the expect on the response and requestResult');
    
    it('The first entry in the array has known properties', function(done) {
        expect(requestResult[0]).to.include.keys('chefName');
        expect(response.body).to.not.be.a.string;
        done();
    });
    
    
    it('The elements in the array have the expected properties', function(done) {
        expect(response.body).to.satisfy(
            function (body) {
                for (var i = 0; i < body.length; i++) {
                    expect(body[i]).to.have.property('_id').that.is.a('string');
                    expect(body[i]).to.have.property('chefId').that.is.a('string');
                    expect(body[i]).to.have.property('chefName').that.is.a('string');
                    expect(body[i]).to.have.property('description').that.is.a('string');
                    expect(body[i]).to.have.property('image').that.is.a('string');
                    expect(body[i]).to.have.property('recipeID').that.is.a('array');
                    expect(body[i]).to.have.property('restraunt').that.is.a('string');
                }
                return true;
            });
        done();
    });
});

