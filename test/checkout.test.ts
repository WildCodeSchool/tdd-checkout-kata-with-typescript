describe("checkout test", () => {
  it("should return 0 when no items are sent", () => {
    expect(checkout("")).toBe(0)
  })
})
