//
//  ViewController.swift
//  RxSwift_HelloWorld
//
//  Created by Yu Pin Weng on 2017/12/16.
//  Copyright © 2017年 Yu Pin Weng. All rights reserved.
//

import UIKit
import RxCocoa
import RxSwift

class ViewController: UIViewController {
    
    @IBOutlet weak var tableview: UITableView!
    
    let disposeBag = DisposeBag()
    let cellIdentifier = "RxCell"
    
    override func viewDidLoad() {
        
        super.viewDidLoad()
        tableviewTest()
        // rxTableViewTest()
    }
}

extension ViewController {
    
    func rxTableViewTest() {
        
        /// func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int
        let items = Observable.just( (0...20).map{ "\($0)" })
        
        /// tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell
        items.bind(to: tableview.rx.items(cellIdentifier: cellIdentifier, cellType: UITableViewCell.self)) { (row, elememt, cell) in
            cell.textLabel?.text = "\(elememt) @row \(row)"
        }.disposed(by: disposeBag)
        
        /// func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath)
        tableview.rx
            .modelSelected(String.self)
            .subscribe( onNext:{ value in
                if let selectedRowIndexPath = self.tableview.indexPathForSelectedRow {
                    self.tableview.deselectRow(at: selectedRowIndexPath, animated: true)
                }
                print("click \(value)")
            }
        ).disposed(by: disposeBag)
    }
}

extension ViewController: UITableViewDataSource, UITableViewDelegate {
    
    func tableviewTest() { tableview.delegate = self; tableview.dataSource = self }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int { return 20 }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        guard let rxCell = tableview.dequeueReusableCell(withIdentifier: cellIdentifier) else { return UITableViewCell() }
        rxCell.textLabel?.text = "\(indexPath.row)"
        return rxCell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        if let selectedRowIndexPath = tableview.indexPathForSelectedRow {
            tableview.deselectRow(at: selectedRowIndexPath, animated: true)
        }
        print("click \(indexPath.row)")
    }
}

