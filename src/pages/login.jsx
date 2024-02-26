import { Link } from 'react-router-dom'
export default function Login(){
    return(
        <>
            <div className="container-fluid py-5">
                <div className="container-px-5">
                    <div className="card p-5 bg-color-2">
                        <div className="row">
                            <div className="col-sm-6">
                                <img src="/Images/Peace-of-Mind.png" alt="card image" className='img-fluid' />
                            </div>
                            <div className="col-sm-6">
                                <div className="pt-5">
                                    <div className="h2 fw-bold">Login to ClaimSolution.in</div>
                                    <div className="text">Lorem ipsum odor amet, consectetuer adipiscing elit. Gravida ac fames. Natoque orci mus enim. Convallis sodales. Dignissim montes consectetur turpis. Maximus donec. Quam interdum phasellus a</div>
                                    <div className="mb-3 mt-3">
                                        <label for="username" className="form-label">Username: </label>
                                        <input type="text" className="form-control" id="username" placeholder="username" />
                                    </div>
                                    <div className="mb-3 mt-3">
                                        <label for="username" className="form-label">Password: </label>
                                        <input type="text" className="form-control" id="password" placeholder="Your password" />
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                        <label class="form-check-label" for="flexCheckDefault">
                                            checkbox for user
                                        </label>
                                        <label class="float-end" >
                                            <Link to="#" className="color-1 text-decoration-underline">Forget password</Link>
                                        </label>
                                    </div>
                                    <div className="mb-3 mt-5">
                                        <button type="submit" class="btn bg-color-5 color-1 w-100">Log In</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}