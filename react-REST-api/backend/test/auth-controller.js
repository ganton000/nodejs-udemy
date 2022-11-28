const expect = require("chai").expect;
const sinon = require("sinon");

const User = require("../models/user");
const AuthController = require("../controllers/auth");

describe("Auth Controller - Login", function () {
    it("should throw a 500 error code if accessing the database fails", function (done) {
        sinon.stub(User, "findOne");
        User.findOne.throws();

        const req = {
            body: {
                email: "test@test.com",
                password: "exampletest",
            },
        };
        AuthController.login(req, {}, () => {}).then((result) => {
            expect(result).to.be.an("error");
            expect(result).to.have.property("statusCode", 500);
            done();
        });

        User.findOne.restore();
    });
});
