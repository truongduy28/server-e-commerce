const testMiddleWare = (req: any, res: any) => {
    res.status(200).json({
        message: "Test Middleware",
        data: [
            {
                name: "test",
                key: "value"
            },
            {
                name: "test2",
                key: "value2"
            }
        ]
    })
}

export { testMiddleWare }