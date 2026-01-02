import Hero from '../components/Hero'
import Services from '../components/Services'
import Projects from '../components/Projects'

const Home = () => {
  return (
    <>
      <Hero />
      <Services />
      <Projects limit={3} showViewAll={true} />
    </>
  )
}

export default Home

