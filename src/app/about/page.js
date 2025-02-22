import Link from "next/link";
const page = () => {
    return <div className="bg-gray-900 h-screen">
     <nav className="bg-gray-900 text-white px-4 py-3">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">NLP to SQL</Link>
        </div>
    </nav>
    <h1 className="text-3xl text-white text-center font-semibold mt-5">About</h1>
    <p className="m-3">
        Hello 👋, This fullstack AI application was built by Nihal and Ratnesh. <br /> <br />
        💼 If you're interested in hiring us or have any ideas for collaboration, we'd be happy to work with you!

    </p>
    <h2 className="text-2xl text-white text-center font-semibold mt-5">Contact</h2>
    <div className="m-3">
    <p>
        <b>Nihal Kumar</b> <br />
        LinkedIn: <a className="text-purple-600" href="https://www.linkedin.com/in/thisisnihal/" target="_blank" rel="noopener noreferrer">linkedin.com/in/thisisnihal/</a>
    </p>
    <br />
    <p>
        <b>Ratnesh Vaibhav Pandey</b> <br />
        LinkedIn: <a className="text-purple-600" href="https://www.linkedin.com/in/ratnesh-vaibhav-pandey-502570154/" target="_blank" rel="noopener noreferrer">linkedin.com/in/ratnesh-vaibhav-pandey-502570154/</a>
    </p>
    </div>
    </div>
}

export default page;