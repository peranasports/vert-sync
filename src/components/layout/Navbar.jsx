import PSLogo from '../assets/PeranaSportsSquare512.png'
import VertLogo from '../assets/Vert512.png'
import { Link } from 'react-router-dom'
import PropsType from 'prop-types'

function Navbar({ title }) {
    return <nav className='navbar shadow-lg bg-neutral text-neutral-content'>
        <div className='container mx-auto'>
            <div className='flex px-2 mx-2 space-x-4'>
                <img className='pt-1 h-10 w-10' alt='' src={VertLogo} />
                <Link to='/' className='text-2xl pt-1 font-bold align-middle'>
                    {title}
                </Link>
            </div>
            <div className='flex-1 px2 mx-2'>
                <div className='flex justify-end'>
                    <Link to='/' className='btn btn-ghost btn-sm rounded-btn'>
                        Home
                    </Link>
                    <Link to='/importpackages' className='btn btn-ghost btn-sm rounded-btn'>
                        Import
                    </Link>
                    <Link to='/about' className='btn btn-ghost btn-sm rounded-btn'>
                        About
                    </Link>
                </div>
            </div>
            <div>
            <img className='pt-1 h-10 w-10' alt='' src={PSLogo} />
            </div>
        </div>
    </nav>
}

Navbar.defaultProps = {
    title: 'VERT - Stats - Video Sync'
}

Navbar.PropsType = {
    title: PropsType.string,
}
export default Navbar