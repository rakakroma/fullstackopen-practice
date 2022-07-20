import { func } from "prop-types"


describe('Note app', function () {


  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user1 = {
      "name": "Ohtani",
      "username": "ohtani333",
      "password": "ohtani666"
    }
    const user2 = {
      name: "Jacko",
      username: "jacka33",
      password: "jacka66"
    }
    cy.request('POST', "http://localhost:3003/api/users", user1)
    cy.request('POST', "http://localhost:3003/api/users", user2)
    cy.visit('http://localhost:3000')
  })

  it('front page is opened and login form is shown', function () {
    cy.contains('log in to the application')
    cy.contains('username')
    cy.contains('password')
  })

  describe('login test', function () {

    it('user can login', function () {
      cy.get('#username').type('ohtani333')
      cy.get('#password').type('ohtani666')
      cy.get('#login-button').click()
      cy.contains('Ohtani logged in')
    })

    it('user can not login, wrong password', function () {
      cy.get('#username').type('ohtani333')
      cy.get('#password').type('notohtanispassword')
      cy.get('#login-button').click()
      cy.contains('wrong username or password')
    })

    it('user can not login, wrong username', function () {
      cy.get('#username').type('ohtani777')
      cy.get('#password').type('ohtani666')
      cy.get('#login-button').click()
      cy.contains('wrong username or password')
    })

    describe('when logged in', function () {

      beforeEach(function () {
        const loginInfo = {
          username: "ohtani333",
          password: "ohtani666"
        }
        // cy.request('POST', "http://localhost:3003/api/login", loginInfo)
        // .then(response => {
        //   localStorage.setItem('loggedBlogappUser', JSON.stringify(response.body))
        //   cy.visit('http://localhost:3000')
        // })
        cy.login(loginInfo)
      })

      it('user is logged in', function () {
        cy.contains('Ohtani logged in')
      })

      it('a blog can be created', function () {
        cy.contains('new note').click()
        cy.get('input#title').type('good blog')
        cy.get('input#author').type('JK Rolling')
        cy.get('input#url').type('www.qqqq.com')
        cy.contains('post blog').click()
        cy.contains('good blog JK Rolling')
        cy.visit('http://localhost:3000')
      })

      describe('after created blogs', function () {

        beforeEach(function () {
          cy.createBlog({ title: "test blog 1", author: "Tanaka", url: "66.tw" })
          cy.createBlog({ title: "test blog 2", author: "Yaro", url: "88.jp" })

        })

        it('like created blogs', function () {
          cy.contains('test blog 1 Tanaka').contains('view').click()
          cy.contains('👍🏿👍🏿👍🏿').click()
          cy.contains("you've just liked a blog test blog 1 by Tanaka!")
          cy.get('span.likes-count').contains(1)
          cy.contains('👍🏿👍🏿👍🏿').click()
          cy.get('span.likes-count').contains(2, { timeout: 5000 })
          cy.contains('👍🏿👍🏿👍🏿').click()
          cy.get('span.likes-count').contains(3, { timeout: 5000 })

          cy.contains('test blog 2 Yaro').as('secBlog').contains('view').click()
          cy.get("@secBlog").contains('👍🏿👍🏿👍🏿').click()
          cy.contains("you've just liked a blog test blog 2 by Yaro!")
          cy.get('@secBlog').get('span.likes-count').contains(1)
          cy.get("@secBlog").contains('👍🏿👍🏿👍🏿').click()
          cy.get('@secBlog').get('span.likes-count').contains(2, { timeout: 5000 })

        })

        it('like blogs created by others', function () {
          cy.contains("log out").click()
          cy.login({ username: "jacka33", password: "jacka66" })
          cy.contains('Jacko logged in')

          cy.contains('test blog 1 Tanaka').contains('view').click()
          cy.contains('👍🏿👍🏿👍🏿').click()
          cy.contains("you've just liked a blog test blog 1 by Tanaka!")
          cy.get('span.likes-count').contains(1)

          cy.contains('test blog 2 Yaro').as('secBlog').contains('view').click()
          cy.get("@secBlog").contains('👍🏿👍🏿👍🏿').click()
          cy.contains("you've just liked a blog test blog 2 by Yaro!")
          cy.get('@secBlog').get('span.likes-count').contains(1)

        })

        it('delete created blog by who create it', function () {
          cy.contains('test blog 2 Yaro').as('secBlog').contains('view').click()
          cy.get("@secBlog").contains(/remove/).click()
          cy.contains("you've remove a blog!")
          cy.get("@secBlog").should('not.exist')
        })

        it("can't delete blogs created by others", function () {
          cy.contains("log out").click()
          cy.login({ username: "jacka33", password: "jacka66" })
          cy.contains('Jacko logged in')

          cy.contains('test blog 2 Yaro').as('secBlog').contains('view').click()
          cy.get("@secBlog").contains(/remove/).should('not.be.visible')
          cy.get("@secBlog").contains(/remove/).click({ force: true })
          cy.contains("the deletion was failed, please check your internet connection")

        })

        it('sort blogs by likes count', function () {

          cy.get('.blog-post').eq(0).contains('test blog 1 Tanaka')

          cy.contains('test blog 2 Yaro').as('secBlog').contains('view').click()
          cy.get("@secBlog").contains('👍🏿👍🏿👍🏿').click()
          cy.get('@secBlog').get('span.likes-count').contains(1)

          cy.get('.blog-post').eq(0).contains('test blog 2 Yaro')

          cy.contains('test blog 1 Tanaka').as('firstBlog').contains('view').click()
          cy.get('@firstBlog').contains('👍🏿👍🏿👍🏿').click()
          cy.get('@firstBlog').get('span.likes-count').contains(1)
          cy.get('@firstBlog').contains('👍🏿👍🏿👍🏿').click()
          cy.get('@firstBlog').get('span.likes-count').contains(2, { timeout: 5000 })

          cy.get('.blog-post').eq(0).contains('test blog 1 Tanaka')

        })

      })
    })
  })
})