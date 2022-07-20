const { all } = require("../app")

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((total, blog) => {
        return total + blog.likes
    }, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((favorite, blog) => {
        console.log('fav', favorite, 'blog', blog)
        if (!favorite) {
            return blog
        } else if (favorite.likes >= blog.likes) {
            return favorite
        } else {
            return blog
        }
    })
}

const mostBlogs = (blogs) => {
    const countBloggers = blogs.reduce((allBloggersCount, blogger) => {
        const authorName = blogger.author;
        // console.log('count', allBloggersCount, 'author', authorName);
        if (!allBloggersCount[authorName]) {
            allBloggersCount[authorName] = 1;
        } else {
            allBloggersCount[authorName] += 1;
        }
        return allBloggersCount
    }, {});
    const theMaxValueObject = Object.entries(countBloggers).reduce((maxValueObject, object) => {
        if (!maxValueObject) return object;
        if (maxValueObject[1] > object[1]) return maxValueObject;
    }, 0)
    const result = {
        author: theMaxValueObject[0],
        blogs: theMaxValueObject[1]
    }
    console.log("result", result);
    return result
};


const mostLikes = (blogs) => {
    const countBloggers = blogs.reduce((allBloggersLikeCount, blogger) => {
        const authorName = blogger.author;
        // console.log('count', allBloggersLikeCount, 'author', authorName);
        if (!allBloggersLikeCount[authorName]) {
            allBloggersLikeCount[authorName] = blogger.likes;
        } else {
            allBloggersLikeCount[authorName] += blogger.likes;
        }
        return allBloggersLikeCount
    }, {});
    console.log('countBloggers', countBloggers);
    const theMaxValueObject = Object.entries(countBloggers).reduce((maxValueObject, object) => {
        if (!maxValueObject) return object;
        if (maxValueObject[1] > object[1]) {
            return maxValueObject
        } else {
            return object
        }
    }, 0)
    const result = {
        author: theMaxValueObject[0],
        likes: theMaxValueObject[1]
    }
    console.log("result", result);
    return result
}




module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
